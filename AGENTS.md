# Agent Instructions

ForgeKit TanStack Start is a full-stack starter kit, sibling to `forgekit` (.NET + Next.js).
Products are forked from it and then diverge, so keep changes reusable across products rather
than tailored to the sample TODO domain.

**Stack.** API: .NET 10 minimal API via Anvil, EF Core (used directly, no repositories),
MediatR, FluentValidation, Result pattern, JWT, Serilog, Scalar. App: TanStack Start (Vite),
React 19, TypeScript, TanStack Router (file-based, `app/src/routes/`), StyleX through the
`shadcn-cssinjs` registry on Base UI (no Tailwind, no CSS modules), TanStack Query and Table
called from server functions (no BFF layer), Zustand, Better Auth. Database: SQLite by
default, PostgreSQL and SQL Server supported; the API and Better Auth share one
`Database__Provider` (root `.env`).

Backend conventions are inherited from `forgekit`, whose ADRs give the reasons: ADR-002 (soft
delete), ADR-004 (EF Core directly), ADR-006 (Result pattern), ADR-008 (layer boundary).

## The layer boundary in `api/`

- **`api/Anvil/`** is the shared layer forked from `forgekit`, at identical paths, so it syncs
  with `git checkout upstream/main -- api/Anvil api/Anvil.Tests` (`upstream` = `forgekit`).
  The build fails if it references the product project. Procedure: `docs/ANVIL_SYNC.md`.
- **`api/ForgeKit.Api/`** is the product layer.

Change Anvil in `forgekit` first and sync it here; an edit made only here is overwritten by
the next sync.

## The layer boundary in `app/src/`

Feature-Sliced Design, enforced by `pnpm lint:fsd` (steiger): `app` → `pages` → `widgets` →
`features` → `entities` → `shared`, imports flowing downward only. `src/routes/` sits outside
the layers and only composes `pages/` slices. Client state read across slices is a Zustand
slice under `shared/state/slices/` (pattern: `ui.slice.ts`, wired in `shared/state/`), not
component state.

## Building and testing

```bash
cd api && dotnet build && dotnet test
cd app && pnpm install && pnpm check && pnpm lint && pnpm lint:fsd && pnpm test
pnpm verify                       # the full local gate, from the repository root
```

`pnpm test:e2e` (in `app/`) migrates its own SQLite database, builds, and serves a preview.
There is no component-level UI coverage: verify UI changes in the running app with the
`verify-forgekit-tanstack` skill and attach its evidence.

## Conventions the checks cannot enforce

- **Add migrations for all three providers** (`ForgeKit.Api.Migrations.{Sqlite,Postgres,SqlServer}`)
  when the EF model changes; never reuse one provider's migrations for another.
- **Product query filters must be named** — `HasQueryFilter("Name", ...)`. The soft-delete
  filter is `PlatformDbContext.SoftDeleteFilter`; an anonymous filter on a soft-delete entity
  fails at model build.
- **Tests**: xUnit + Shouldly for the API (SQLite for relational integration tests), vitest for
  the app.
- **Conventional Commits**; branch off main as `feature/`, `fix/`, `chore/`, or `refactor/` and
  open a PR. Branch protection requires CI and a merge commit — never squash or rebase. Enable
  the hook that refuses commits on main: `git config core.hooksPath .githooks`.
- **Never commit local secrets.** `appsettings.Local.json` and `.env.local` are ignored and
  have `.example` counterparts.

## AI workflow

pstack is installed at project scope (`/pstack:poteto-mode <task>` is the entry point). When
the decisions are still open — a new product's domain, a new module, auth/tenant/permission
models, a public API shape — grill first: `/grill-with-docs` → `/to-spec` → pstack. Bug fixes,
refactors, and dependency bumps skip the grill. Details: `docs/AI_WORKFLOW.md`.

Issues and specs live in GitHub Issues (`docs/agents/issue-tracker.md`); `/to-spec` labels
them `ready-for-agent`. Domain docs are single-context: a root `GLOSSARY.md` and `docs/adr/`,
both created when first needed (`docs/agents/domain.md`).

## Where things are documented

| Topic | File |
|---|---|
| Syncing `api/Anvil/` from `forgekit` | `docs/ANVIL_SYNC.md` |
| API setup and structure | `api/README.md` |
| App setup and structure | `app/README.md` |
| The full verification sequence | `scripts/verify.sh` |
