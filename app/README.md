# app

The TanStack Start frontend for ForgeKit TanStack Start: React 19, TanStack Router (file-based
routing), TanStack Query (server state), TanStack Table (tabular UI), Zustand (client state),
and [StyleX](https://stylexjs.com/) via `shadcn-cssinjs` for styling (Base UI primitives +
a StyleX component registry — no Tailwind, no CSS modules).

```bash
pnpm install
pnpm dev
```

## Structure

The app follows [Feature-Sliced Design](https://feature-sliced.design/), enforced by `steiger`
(`pnpm lint:fsd`):

```
src/
├── routes/     # TanStack Router's file-based routes. These compose pages/ slices and
│               # hold no logic of their own — see src/pages/home for the pattern.
├── app/        # App-wide setup: providers, root document composition (RootDocument)
├── pages/      # Route-level page compositions, one slice per route
├── widgets/    # Composite UI blocks combining multiple features/entities
├── features/   # User-facing actions (a form, a toggle, a single interaction)
├── entities/   # Business entities and their UI/data
└── shared/     # Reusable, business-agnostic code:
    ├── ui/       # shadcn-cssinjs component set (Button, Table, DataTable, ...)
    ├── api/      # TanStack Query setup (QueryProvider, makeQueryClient)
    ├── lib/      # Utilities and StyleX design tokens (tokens.stylex.ts)
    ├── state/    # Zustand store(s)
    └── styles/   # Shared style tokens/utilities (global CSS custom properties
                  # currently live in src/styles.css; see that file's :root block)
```

Imports only flow downward — a higher layer (e.g. `pages/`) may import from a lower one
(e.g. `shared/`), never the reverse. Each slice/segment exposes its public surface through an
`index.ts`; import from that, not from another slice's internals.

To add a new route: create a `pages/<name>/` slice with its own `ui/` segment and `index.ts`,
then add a thin `routes/<name>.tsx` file that imports the page component and wires it to
`createFileRoute`.

## Path alias

Imports use the `#/` alias (Node's `imports` field in `package.json`) for absolute imports
from `src/`, e.g. `import { Button } from '#/shared/ui/button'`.

## Scripts

```bash
pnpm dev          # start the dev server on :3000
pnpm build        # production build
pnpm preview      # preview the production build
pnpm check        # tsc --noEmit
pnpm lint         # eslint
pnpm lint:fsd     # steiger — FSD layer boundary checks
pnpm test         # vitest run
pnpm test:watch   # vitest, watch mode
pnpm format       # prettier --write + eslint --fix
```
