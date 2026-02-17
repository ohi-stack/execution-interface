"""
Audit event contracts.

Audit events are immutable records describing what was evaluated
and what decision was produced. They do NOT perform execution.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID


@dataclass(frozen=True)
class AuditEvent:
    """
    Canonical audit record for evaluation flow.

    An audit event captures:
    - when evaluation occurred
    - what input was evaluated
    - what decision was produced

    No execution or side effects are allowed.
    """

    event_id: UUID
    timestamp: datetime

    intake_id: UUID
    decision_id: UUID

    decision_type: str
    metadata: Optional[Dict[str, Any]] = None
