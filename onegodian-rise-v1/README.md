# OneGodian Rise V1 Gameplay Foundation

This folder contains the Task 002 Unreal Engine gameplay foundation files for `ohi-stack/onegodian-rise-v1`.

## Task 002 scope

Implemented only the V1 player movement and camera foundation:

- `BP_PlayerCharacter` is represented by the native `AOneGodianPlayerCharacter` class for blueprint creation/configuration.
- Walk, run/sprint, jump, player rotation, and third-person camera follow are configured in code.
- `GenesisDistrictOne` can use `AGenesisDistrictOneGameMode` to spawn the player character at a valid `APlayerStart`.
- `AGenesisDistrictOneFoundation` provides an optional basic test platform.
- Falling below the reset height triggers a simple respawn/reset.

Excluded by design: collectibles, OHI Core, portals, drones, mission objectives, multiplayer, blockchain, ODC, Layer 2, marketplace/economy, accounts, driving, flying, and open-world systems.
