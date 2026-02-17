"""
Runtime configuration contracts.

Configuration defines *boundaries*, not behavior.
These settings constrain execution environments without
triggering execution or side effects.

All values are declarative and immutable once loaded.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class ExecutionMode(str, Enum):
    """
    Declares how strictly execution is constrained.
    """

    DRY_RUN = "dry_run"        # No side effects permitted
    VALIDATION_ONLY = "validation_only"
    CONTROLLED = "controlled" # Explicitly allowed actions only


class SideEffectPolicy(str, Enum):
    """
    Defines how side effects are handled.
    """

    FORBIDDEN = "forbidden"
    EXPLICIT_ONLY = "explicit_only"


@dataclass(frozen=True)
class RuntimeLimits:
    """
    Hard execution limits.

    These values prevent runaway or unsafe execution.
    """

    max_rules_evaluated: int
    max_decision_depth: int
    max_execution_time_ms: int


@dataclass(frozen=True)
class RuntimeConfig:
    """
    Declarative runtime boundary configuration.

    This object defines *what execution may do*, not *how it does it*.
    """

    execution_mode: ExecutionMode
    side_effect_policy: SideEffectPolicy

    limits: RuntimeLimits

    environment: Optional[str] = None
    version: Optional[str] = None
