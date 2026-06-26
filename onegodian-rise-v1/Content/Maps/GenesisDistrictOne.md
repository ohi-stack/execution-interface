# GenesisDistrictOne test level setup

Create the Unreal map asset at `/Game/Maps/GenesisDistrictOne` and apply this minimal Task 002 setup:

1. Set GameMode Override to `GenesisDistrictOneGameMode`.
2. Add one `PlayerStart` above the platform, for example location `(0, 0, 180)`.
3. Add `GenesisDistrictOneFoundation` to create the basic collision platform if the level does not already contain a floor.
4. Create Blueprint `BP_PlayerCharacter` from `AOneGodianPlayerCharacter` only if designers need Blueprint-tunable defaults; otherwise the native pawn is already configured as the default spawn class.
5. Keep the level limited to movement/camera testing until later tasks add collectibles, missions, enemies, portals, economy, online, or open-world systems.
