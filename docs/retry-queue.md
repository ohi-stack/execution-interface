# Quantum OHI Bridge Retry Queue

## Queue behavior
- Table: `wp_qohi_retry_queue`.
- Enqueue on network failure, timeout-like transport failure, 5xx response, or open-circuit condition.
- No automatic retry for 4xx validation/auth failures.

## Scheduling
- Worker hook: `qohi_bridge_retry_worker`.
- Interval: every minute via custom cron schedule.
- Worker processes one pending row defensively and marks status transitions (`pending` → `processing` → `completed`/`failed`).

## Backoff
- `next_attempt_at = now + 2^attempts minutes`.
- Backoff cap: 60 minutes.
- Max attempts per job: 5.
