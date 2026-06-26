#include "GenesisDistrictOneFoundation.h"

#include "Components/StaticMeshComponent.h"
#include "UObject/ConstructorHelpers.h"

AGenesisDistrictOneFoundation::AGenesisDistrictOneFoundation()
{
    PrimaryActorTick.bCanEverTick = false;

    TestPlatform = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BasicTestPlatform"));
    RootComponent = TestPlatform;

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeMesh(TEXT("/Engine/BasicShapes/Cube.Cube"));
    if (CubeMesh.Succeeded())
    {
        TestPlatform->SetStaticMesh(CubeMesh.Object);
    }

    TestPlatform->SetWorldScale3D(FVector(20.0f, 20.0f, 0.25f));
    TestPlatform->SetCollisionProfileName(TEXT("BlockAll"));
}
