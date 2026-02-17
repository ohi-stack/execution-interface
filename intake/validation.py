"""
Intake Validation Invariants

Defines structural and semantic checks for IntakeRequest objects.
Validation here is deterministic and side-effect free.
"""

from typing import List

from intake.schema import IntakeRequest


class IntakeValidationError(Exception):
    """
    Raised when an intake request violates required invariants.
    """
    def __init__(self, errors: List[str]):
        self.errors = errors
        super().__init__("Invalid intake request")


def validate_intake(request: IntakeRequest) -> None:
    """
    Validate an IntakeRequest against required invariants.

    Raises:
        IntakeValidationError if validation fails.
    """
    errors: List[str] = []

    if not request.intent or not request.intent.strip():
        errors.append("Intent must be a non-empty string.")

    if request.payload is None:
        errors.append("Payload must be provided.")

    if request.payload and not isinstance(request.payload.data, dict):
        errors.append("Payload data must be a dictionary.")

    if errors:
        raise IntakeValidationError(errors)
