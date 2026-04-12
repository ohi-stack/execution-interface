# Changelog

## 1.1.0 - 2026-04-09

- Replaced scaffold verification portal behavior with Onegodian canonical time authority API routes.
- Implemented deterministic OTS-V5-corrected conversion functions for Gregorian↔OT, OT day order, OT leap-year detection, and OT year length.
- Added canonical timestamp normalization schema, explicit validation errors, and unit tests for epoch, rollover, day-order, and leap behavior.
- Updated README to document canonical standards and endpoint examples.
