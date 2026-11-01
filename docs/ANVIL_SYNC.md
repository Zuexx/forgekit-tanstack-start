# Syncing api/Anvil and api/Anvil.Tests from forgekit

`api/Anvil/` and its tests in `api/Anvil.Tests/` are not this repo's own code — they are
forked from `forgekit` and kept in step the same way forgekit's own downstream products are,
per ADR-008 in forgekit.

To pull in upstream changes:

    git fetch upstream main
    git checkout upstream/main -- api/Anvil api/Anvil.Tests
    git status   # review what changed before committing

`api/ForgeKit.Api/` is this repo's own product layer and is never touched by this sync.
