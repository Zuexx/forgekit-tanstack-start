# ForgeKit TanStack Start

A full-stack starter kit pairing a .NET API with a [TanStack Start](https://tanstack.com/start)
frontend, demonstrating project conventions through a small TODO service. It is a sibling of
[`forgekit`](https://github.com/Zuexx/forgekit) (.NET + Next.js) in the ForgeKit family: same
backend conventions, same spec-driven workflow, different frontend stack.

## Architecture

```
forgekit-tanstack-start/
├── api/          # C# .NET 10 Web API (ASP.NET Core)
│   ├── ForgeKit.sln
│   ├── Anvil/                 # Shared layer, forked from forgekit — see docs/ANVIL_SYNC.md
│   ├── ForgeKit.Api/          # Product layer
│   └── ForgeKit.Api.Tests/    # Test project
│
└── app/          # TanStack Start frontend (TypeScript)
    └── src/
        ├── routes/    # File-based routes — compose pages/ slices, hold no logic themselves
        ├── app/       # App-wide setup: providers, root document composition
        ├── pages/     # Route-level page compositions
        ├── widgets/   # Composite UI blocks
        ├── features/  # User-facing actions
        ├── entities/  # Business entities
        └── shared/    # Cross-cutting, business-agnostic code (ui/, api/, lib/, state/, styles/)
```

The frontend follows strict [Feature-Sliced Design](https://feature-sliced.design/), enforced by
`steiger` (`pnpm lint:fsd`). Imports only flow downward, from a higher layer to a lower one.

## Tech stack

| Layer | Technology |
|-------|-----------|
| **Backend framework** | ASP.NET Core 10 (Minimal APIs), via Anvil |
| **ORM** | Entity Framework Core — SQLite by default, PostgreSQL/SQL Server optional |
| **CQRS** | MediatR |
| **Validation** | FluentValidation |
| **Auth (API)** | JWT Bearer |
| **Logging** | Serilog (structured) |
| **API docs** | Scalar |
| **Frontend framework** | [TanStack Start](https://tanstack.com/start) (Vite-based), React 19 |
| **Routing** | TanStack Router (file-based) |
| **Styling** | [StyleX](https://stylexjs.com/) via `shadcn-cssinjs` (Base UI primitives + StyleX component registry) — no Tailwind, no CSS modules |
| **Server state** | TanStack Query |
| **Tabular UI** | TanStack Table |
| **Client state** | Zustand |
| **Package manager** | pnpm |

## Getting started

### Start a new project from this kit

Fork or clone this repo as the starting point for a new product; unlike `forgekit`, it does not
yet ship a `dotnet new` template, so renaming the solution/namespaces/package name is currently
a manual step.

### Prerequisites

- **.NET 10** (for the API)
- **Node.js 22+** and **pnpm 11+** (for the app)

Neither side requires an external database to start — both default to a shared SQLite file.
PostgreSQL and SQL Server are opt-in for both sides together, switched with a single setting
(`Database__Provider` in a repository-root `.env`, copied from `.env.example`).

### API

```bash
cd api
dotnet restore
dotnet build
dotnet run --project ForgeKit.Api
```

See [`api/README.md`](api/README.md) for migrations and provider configuration.

### App

```bash
cd app
pnpm install
pnpm dev
```

App runs on `http://localhost:3000`. See [`app/README.md`](app/README.md) for the FSD layout
and available scripts.

## Verification

```bash
pnpm verify
```

Runs the full local/CI gate: API build + test, app `check`/`lint`/`lint:fsd`/`test`/`build`,
OpenSpec validation, and a secret scan. See [`scripts/verify.sh`](scripts/verify.sh).

## Documentation

- [`docs/ANVIL_SYNC.md`](docs/ANVIL_SYNC.md) — syncing `api/Anvil/` from `forgekit`
- [`api/README.md`](api/README.md) — API setup and structure
- [`app/README.md`](app/README.md) — frontend setup and structure
- [`openspec/`](openspec/) — spec-driven change proposals and the project's context/conventions

## Relationship to `forgekit`

This repo shares `forgekit`'s backend conventions (module + feature pattern, soft delete,
the Result pattern, EF Core over repositories) and its spec-driven workflow, forked from
`forgekit`'s `api/Anvil/` layer. It diverges on the frontend: TanStack Start + StyleX instead
of Next.js + Tailwind, since the two starters target different frontend preferences while
staying interchangeable on the backend.

## License

MIT. See [LICENSE](LICENSE).
