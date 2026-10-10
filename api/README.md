# ForgeKit API

This repo does not yet have its own `docs/api/`, `docs/adr/`, or `docs/SAMPLES.md` — the only
document under `../docs/` today is [`ANVIL_SYNC.md`](../docs/ANVIL_SYNC.md), which explains how
`api/Anvil/` is kept in sync with its upstream source.

`api/Anvil/` is forked from [`forgekit`](https://github.com/Zuexx/forgekit), which does have these
documents. Until this repo grows its own, the forgekit equivalents are the closest available
reference:

- API documentation: forgekit's `docs/api/` (e.g. `API_ERRORS.md`, `CONFIGURATION_GUIDE.md`)
- Architecture decision records: forgekit's `docs/adr/`
- Starter-kit sample guidance: forgekit's `docs/SAMPLES.md`

They describe forgekit's own product layer, not this repo's, so treat them as background on the
shared `Anvil` conventions rather than as documentation of anything under `api/ForgeKit.Api/`.
