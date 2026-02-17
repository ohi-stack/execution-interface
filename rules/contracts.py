"""
Rule Contracts

Defines the canonical interface for deterministic rule evaluation.
Rules are pure, side-effect-free predicates over validated intake.
"""

from abc import ABC, abstractmethod
from typing import Protocol

from intake.schema import IntakeRequest


class Rule(Protocol):
    """
    A rule evaluates an intake and returns a boolean result.
    """

    def applies(self, request: IntakeRequest) -> bool:
        ...


class AbstractRule(ABC):
    """
    Base class for rule implementations.
    """

    @abstractmethod
    def applies(self, request: IntakeRequest) -> bool:
        """
        Return True if the rule applies to the given intake.
        """
        raise NotImplementedError
