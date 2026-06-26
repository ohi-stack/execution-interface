#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "OneGodianPlayerCharacter.generated.h"

class UCameraComponent;
class USpringArmComponent;

UCLASS(Blueprintable, BlueprintType)
class ONEGODIANRISEV1_API AOneGodianPlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AOneGodianPlayerCharacter();

    virtual void Tick(float DeltaSeconds) override;
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    USpringArmComponent* CameraBoom;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    UCameraComponent* FollowCamera;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Movement")
    float WalkSpeed = 450.0f;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Movement")
    float SprintSpeed = 750.0f;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Respawn")
    float FallResetZ = -1200.0f;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Respawn")
    FVector FallbackSpawnLocation = FVector(0.0f, 0.0f, 180.0f);

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Respawn")
    FRotator FallbackSpawnRotation = FRotator::ZeroRotator;

private:
    void MoveForward(float Value);
    void MoveRight(float Value);
    void StartSprint();
    void StopSprint();
    void ResetAfterFall();
};
