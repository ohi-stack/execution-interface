"""
Intake Schema Contract

Defines the canonical structure for all incoming execution requests.
This module declares *what* an intake must look like, not *how* it is processed.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, Optional
from datetime import datetime
from uuid import UUID, uuid4


@dataclass(frozen=True)
class IntakeMetadata:
    """
    System-level metadata attached to every intake.
    Used for traceability, auditing, and routing.
    """
    request_id: UUID = field(default_factory=uuid4)
    received_at: datetime = field(default_factory=datetime.utcnow)
    source: Optional[str] = None
    actor: Optional[str] = None
    correlation_id: Optional[str] = None


@dataclass(frozen=True)
class IntakePayload:
    """
    Business-agnostic payload container.

    The execution interface does not interpret payload contents.
    Payload meaning is defined downstream by rules and decisions.
    """
    data: Dict[str, Any]


@dataclass(frozen=True)
class IntakeRequest:
    """
    Canonical intake object passed into the execution interface.

    This is the only accepted entrypoint shape for processing.
    """
    metadata: IntakeMetadata
    payload: IntakePayload
    intent: str
