# App shell and theme

Every page has a light/dark theme switch whose choice survives a reload, with the OS
preference as the first-visit default. Signed-in pages sit in a shell with a collapsible
sidebar whose nav marks the current route.

## Sub-features

- `theme-toggle` switches to dark, changes the rendered background, and keeps dark after a reload.
- `shell-sidebar` renders the sidebar open on `/dashboard`, marks `Dashboard` active, and collapses it.

## How to get to it (user POV)

- The `Switch theme (current: …)` button, on any page.
- Signed in, `/dashboard`: the `Toggle sidebar` button and the sidebar's nav links.

## Driving it with Playwright

Preconditions:

- Baseline from `README.md`. The sidebar step signs in with `signedInAsFreshUser`.

Steps:

- **Theme.** On `/sign-in` the toggle's accessible name is `Switch theme (current: light)`.
  Record `getComputedStyle(document.body).backgroundColor`, click the toggle. `<html>` gets
  class `dark` and the background differs. Reload; `dark` is still set. Evidence: `01-*`, `02-*`
  (`02-backgrounds.json` holds both colors).
- **Sidebar.** On `/dashboard`, `data-testid="app-sidebar"` has `data-open="true"` and the
  `Dashboard` link has `data-status="active"`. Click `Toggle sidebar`; `data-open` becomes
  `false`. Evidence: `03-*`, `04-*`.

Run: `pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts journeys/shell.spec.ts`

## Gotchas

- Compare computed background colors to each other, never to a literal: the CSS is `oklch`,
  the browser reports `rgb(...)`.
- The reload check shows the final class, not paint timing, so it cannot prove there was no
  flash; it proves the blocking script in the document head set the class.
- The OS-preference default is covered by `app/e2e/theme.spec.ts` (`colorScheme: 'dark'`),
  not by this journey.
