# Authentication and route guard

A visitor can create an account with email and password and lands on the dashboard signed in,
can sign in again later, keeps the session across a reload, can sign out from the user menu,
and is refused with a toast on a wrong password. The ABAC route guard sends anonymous visitors
on protected routes to sign-in, and signed-in visitors on sign-in/sign-up to the dashboard.

## Sub-features

- `auth-guard` sends an anonymous visitor on `/dashboard` to `/sign-in`.
- `auth-sign-up` creates the account from the sign-up form and lands on `/dashboard`.
- `auth-signed-in-guard` sends a signed-in visitor on `/sign-in` to `/dashboard`.
- `auth-sign-in` signs an existing account in; the session survives a reload.
- `auth-sign-out` ends the session from the user menu.
- `auth-sign-in-wrong-password` refuses a wrong password and leaves no session.

## How to get to it (user POV)

- Open `/sign-up` (or `/zh-TW/sign-up`), or `/sign-in`, or any guarded URL such as
  `/dashboard` while signed out.
- Signed in: `User menu` (top right of the shell) → `Sign out`.

## Driving it with Playwright

Preconditions:

- Baseline from `README.md`. The journey generates its own email, `verify-<timestamp>@test.local`.

Steps:

- **Guard.** Visit `/dashboard`. The URL ends in `/sign-in`. Evidence: `01-*`.
- **Sign up.** On `/sign-up` fill `#name`, `#email`, `#password`, `#confirmPassword`, click
  the `Create Account` button. The URL ends in `/dashboard`, the `Welcome,` heading shows, and
  `fetch("/api/auth/get-session")` returns the new email. Evidence: `02-*`, `03-*`.
- **Signed-in guard.** Signed in, visit `/sign-in`. The URL ends in `/dashboard`. Evidence: `04-*`.
- **Sign in, then reload.** On `/sign-in` fill `#email` and `#password`, click `Login`
  (exact), reload. The session still returns the email. Evidence: `05-*`.
- **Sign out.** `User menu` → menuitem `Sign out`. The URL ends in `/`, and `/dashboard`
  then redirects to `/sign-in`. Evidence: `06-*`.
- **Wrong password.** Submit a wrong password. A toast renders inside `[data-rht-toaster]`, the
  URL stays on `/sign-in`, and `get-session` has no user. Evidence: `07-*`.
- **Side effect.** Take the email from `evidence/auth/03-session.json` and run
  `vf.sh sql "select u.email, (select count(*) from session s where s.userId = u.id) as sessions from user u where u.email = '<email>'"`.
  Expect one row with at least one session; save it as `evidence/auth/08-db-user-row.json`.

Run: `pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts journeys/auth.spec.ts`

## Gotchas

- The journey is serial: later steps sign in as the account the sign-up step created.
- The toaster wrapper is always in the DOM, even with no toast; assert it has text, not that it
  is visible.
- `vf.sh launch` starts the app with `E2E_TEST=true`, which turns Better Auth's rate limiter
  off (as the e2e suite does). Rate-limit behavior is therefore not covered here.
- Microsoft sign-in needs Azure AD settings the run does not have; it is not covered.
