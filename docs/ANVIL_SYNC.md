# Syncing api/Anvil from forgekit

`api/Anvil/` is not this repo's own code — it is forked from `forgekit` and kept in step the
same way forgekit's own downstream products are, per ADR-008 in forgekit.

To pull in upstream changes:

    git fetch upstream main
    git checkout upstream/main -- api/Anvil
    git status   # review what changed before committing

`api/ForgeKit.Api/` is this repo's own product layer and is never touched by this sync.
