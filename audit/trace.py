"""
Audit trace contracts.

Audit traces provide a linear, immutable record of evaluation steps
from intake through decision. Traces describe *what happened*,
not *what should happen next*.

No execution or side effects are permitted.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from uuid import UUID

from .events import AuditEvent


@dataclass(frozen=True)
class AuditTrace:
    """
    Immutable evaluation trace.

    A trace represents a complete evaluation lifecycle:
    - intake received
    - rules evaluated
    - decision produced
    - events recorded in order

    Traces are append-only at creation time and cannot be modified
    after instantiation.
    """

    trace_id: UUID
    started_at: datetime

    intake_id: UUID

    events: List[AuditEvent] = field(default_factory=list)

    def final_decision_id(self) -> UUID:
        """
        Return the decision ID of the final audit event.

        Raises:
            ValueError if the trace contains no events.
        """
        if not events := self.events:
            raise ValueError("AuditTrace contains no events")
        return events[-1].decision_id
