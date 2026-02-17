"""
Decision Contracts

Defines canonical decision outputs produced after rule evaluation.
Decisions represent finalized, normalized outcomes of execution.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional, Dict, Any


class DecisionType(str, Enum):
    APPROVE = "approve"
    REFUSE = "refuse"
    REVIEW = "review"


@dataclass(frozen=True)
class Decision:
    """
    Immutable decision result.

    A decision is the authoritative outcome of processing an intake
    after validation and rule evaluation.
    """

    decision_type: DecisionType
    reason: str
    metadata: Optional[Dict[str, Any]] = None
