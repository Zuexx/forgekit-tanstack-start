# Domain Docs

How the engineering skills (`/grill-with-docs`, `/domain-modeling`, `/to-spec`) read and write
this repo's domain documentation. Single-context layout.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root: the product's domain language. It does not exist in the
  starter; `/domain-modeling` creates it when the first product term is resolved. It holds
  domain terms only, no implementation details.
- **`docs/adr/`**: read the ADRs that touch the area you are about to work in. It does not
  exist yet either; the first decision that passes the ADR bar creates it.
- **`forgekit`'s `docs/adr/001–008`** cover the backend patterns this repo inherits through
  Anvil (soft delete, EF Core directly, Result pattern, the layer boundary). Do not copy them
  here; cite them as `forgekit ADR-004` and so on.

If a file does not exist, proceed silently; it is created lazily when something is resolved.

## ADR numbering: three digits

ADRs use three digits (`001-...`), matching `forgekit`, not the four-digit `0001-` form the
skill templates show. Start at `001`; the numbering is this repo's own, not a continuation of
`forgekit`'s.

## Use the glossary's vocabulary

When your output names a domain concept (issue title, proposal, test name), use the term as
defined in `GLOSSARY.md`. A concept that is missing is either invented language (reconsider)
or a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, or one of `forgekit`'s inherited ones, say so
explicitly rather than silently overriding:

> _Contradicts forgekit ADR-004 (EF Core over repositories), but worth reopening because..._
