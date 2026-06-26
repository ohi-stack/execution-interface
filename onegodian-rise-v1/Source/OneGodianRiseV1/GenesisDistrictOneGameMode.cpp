#include "GenesisDistrictOneGameMode.h"

#include "OneGodianPlayerCharacter.h"

AGenesisDistrictOneGameMode::AGenesisDistrictOneGameMode()
{
    DefaultPawnClass = AOneGodianPlayerCharacter::StaticClass();
}
