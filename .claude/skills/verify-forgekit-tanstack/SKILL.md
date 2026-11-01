---
name: verify-forgekit-tanstack
description: Launch ForgeKit TanStack Start (the .NET API and the TanStack Start app) on an isolated, disposable SQLite database, drive its features the way a user does with Playwright and curl, and keep screenshots, responses, and database rows as evidence. Use to prove a change works in the running app — any UI, auth, route-guard, locale, theme, or API change — before calling it done or opening a PR.
---

# Verify ForgeKit TanStack Start

Two surfaces, started side by side, that do **not** talk to each other:

- **App** (TanStack Start, production build served by `vite preview`) — sign-up/sign-in, the
  route guard, the dashboard shell, locales, theme. Better Auth runs inside it and owns the
  `user`/`session`/`account` tables.
- **API** (.NET) — `/health*`, the sample `/v1/resources` endpoints, Scalar in Development.

Both share one SQLite file per run, the way they share `data/forgekit.db` in development.
Everything goes through `scripts/vf.sh` (run with `bash`). Feature recipes are in
[`features/`](features/README.md).

## Launch

```bash
bash .claude/skills/verify-forgekit-tanstack/scripts/vf.sh launch            # builds the app first
bash .claude/skills/verify-forgekit-tanstack/scripts/vf.sh launch --no-build # reuse app/dist
```

From an empty run directory it: applies the API's EF migrations (`AppDbContext`) to
`.verify/<run-id>/db/forgekit.db`, creates the Better Auth tables in the same file
(`scripts/migrate-auth.mts`), builds the app (unless `--no-build`), starts `vite preview` on
**:3100** and `dotnet run` on **:5050**, and waits until `GET /health/live` and `GET /sign-in`
answer. It ends by running the doctor. Ports: `VF_APP_PORT`, `VF_API_PORT`.

Use `--no-build` only when nothing under `app/` changed since the last build — a stale build
verifies old code. Auth settings are read at runtime, so `app/dist` is not tied to a port.

Requires: dotnet (the EF tool comes from `.config/dotnet-tools.json`), pnpm with
`app/node_modules` installed, openssl, curl, and Playwright's Chromium
(`cd app && pnpm exec playwright install chromium`).

## Doctor

```bash
bash .claude/skills/verify-forgekit-tanstack/scripts/vf.sh doctor
```

Read-only. Checks `API /health` is 200 (includes the database check), `/sign-in` is 200,
`/api/auth/get-session` is 200, and the run's database file exists. Anything other than
`doctor: OK` means do not drive the instance: read `.verify/<run-id>/logs/*.log`, then
cleanup and relaunch.

It refuses to launch while `.verify/current.env` records a run, so two runs never share an
instance. It never drives the developer's own `:3000`/`:5000` instances or the e2e suite's
`:4173`.

## Drive

Browser journeys are Playwright specs in `journeys/`, run against the launched instance (the
config starts no server). From `app/`:

```bash
eval "$(bash ../.claude/skills/verify-forgekit-tanstack/scripts/vf.sh env)"
pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts
pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts journeys/auth.spec.ts
```

A new journey goes in `journeys/<feature>.spec.ts`, uses the selectors listed in its feature
file, and saves proof with `shot(page, feature, name)` / `record(feature, name, data)` from
`journeys/evidence.ts`. API features are driven with curl against `$VF_API_URL`.

Database state, read-only (no sqlite3 binary needed):

```bash
bash .claude/skills/verify-forgekit-tanstack/scripts/vf.sh sql "select email, name from user"
```

## Evidence

Everything lands in `.verify/<run-id>/evidence/<feature>/` (gitignored):
`*.png` screenshots, `*.json` session/response captures, `playwright/` per-test output.

Proof standards:

- Drive the real user path: the form, the button, the URL. `signedInAsFreshUser()` (sign-up
  through the API) is a *precondition* for getting past the guard, not proof of anything.
- Capture the action and the resulting state — the filled form *and* what came after.
- Check the side effect, not just the screen: after a write, query the row with `vf.sh sql`
  and save the output next to the screenshots.
- For an API change, save the full response (`curl -s -w '\nHTTP %{http_code}\n'`), status
  code included.
- Attach the paths (or the images) to the PR with the feature id they prove.

## Cleanup

```bash
bash .claude/skills/verify-forgekit-tanstack/scripts/vf.sh cleanup
```

Kills the two process trees `launch` started (by recorded PID, then whatever still listens on
the run's own ports — never by name), deletes the run's `db/` and `logs/`, and lists the
evidence it kept. Run it after every run, failed ones included; otherwise the next `launch`
refuses to start.

## Helpers

| File | Purpose |
|---|---|
| `scripts/vf.sh` | `launch [--no-build]`, `doctor`, `env`, `sql "<query>"`, `cleanup` |
| `scripts/migrate-auth.mts` | Creates the Better Auth tables in the run's database |
| `playwright.config.ts` | Points Playwright at `$VF_APP_URL`; output into the evidence folder |
| `journeys/evidence.ts` | `shot()`, `record()`, and the `signedInAsFreshUser()` precondition |
| `journeys/*.spec.ts` | Runnable journeys, one file per feature |

Keep `features/` honest as the app changes: when a route, label, or endpoint changes, update
the feature file and its journey in the same PR.
