#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GenesisDistrictOneFoundation.generated.h"

class UStaticMeshComponent;

UCLASS()
class ONEGODIANRISEV1_API AGenesisDistrictOneFoundation : public AActor
{
    GENERATED_BODY()

public:
    AGenesisDistrictOneFoundation();

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Genesis District One")
    UStaticMeshComponent* TestPlatform;
};
