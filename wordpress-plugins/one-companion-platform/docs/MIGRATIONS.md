# Migrations and upgrades

`OCH_SCHEMA_VERSION` is the target. `OCH_Migrations::registry()` is ordered by integer version and
the runner only advances `och_schema_version` after a migration returns successfully. Version 1
uses `dbDelta`, unique keys, and `CREATE TABLE`, making activation and repeated plugin-load upgrades
idempotent without deleting data.

Failures stop later migrations, write a sanitized message/version/time to the protected WordPress
options table, and log the same non-sensitive diagnostic to the server error log. Administrators can
compare installed and target versions on **Settings → One Companion**. Integration secrets are never
shown there or returned by REST.

## Destructive migration rule and rollback

Never combine destructive changes with ordinary forward migrations. Before a destructive release:

1. publish a data mapping and explicit rollback SQL/script;
2. take and verify a database and upload backup;
3. deploy additive columns/tables first and backfill idempotently;
4. switch reads only after verification; and
5. remove old structures in a later maintenance-window release.

On failure, stop writes, restore the verified backup, restore the prior plugin artifact, verify the
stored schema version, and review protected logs. Do not lower the version option by itself.

> Tables and capabilities are production foundation, not evidence that downstream workflows operate.
