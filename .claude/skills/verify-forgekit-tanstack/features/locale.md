# Locale

The app renders in English (unprefixed URLs) or Traditional Chinese (`/zh-TW/...`). The
language menu switches the rendered text and the URL together, the route guard keeps the
locale prefix when it redirects, and an unsupported first segment is a 404 rather than the
real page.

## Sub-features

- `locale-switch` switches `/sign-in` to `/zh-TW/sign-in` from the language menu.
- `locale-guard` redirects `/zh-TW/dashboard` to `/zh-TW/sign-in` for an anonymous visitor.
- `locale-unknown` serves `Not Found` for `/not-a-real-locale/dashboard`, not the dashboard.

## How to get to it (user POV)

- The `Change language` button on any page, then the language button (`中` for zh-TW).
- Type a `/zh-TW/...` URL directly.

## Driving it with Playwright

Preconditions:

- Baseline from `README.md`.

Steps:

- **Switch.** On `/sign-in`, `[data-slot="card-title"]` reads `Sign in`. Click
  `Change language` (it gets `data-open="true"`), then the button named `中` (exact). The URL
  ends in `/zh-TW/sign-in` and the title reads `登入`. Evidence: `01-*` to `03-*`.
- **Guard keeps the prefix.** Visit `/zh-TW/dashboard` signed out. The URL ends in
  `/zh-TW/sign-in`. Evidence: `04-*`.
- **Unknown segment.** Signed in (`signedInAsFreshUser`), visit `/not-a-real-locale/dashboard`.
  `Not Found` shows and the `Welcome,` heading does not. Evidence: `05-*`.

Run: `pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts journeys/locale.spec.ts`

## Gotchas

- The unknown-segment check needs a signed-in visitor. Signed out, the route guard redirects
  the path to sign-in before the locale check runs, so the step would pass for the wrong
  reason.
- The locale choice is in the URL; a fresh page on an unprefixed URL is English again.
