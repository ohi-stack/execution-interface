# qrv-registry

PostgreSQL schema and seed data for the QR-V first live scan milestone.

## Files

- `migrations/001_init.sql` - creates `qr_issuers`, `qr_objects`, `qr_certificates`, `qr_audit_log`.
- `migrations/002_seed_first_certificate.sql` - seeds first live issuer/object/certificate/audit rows.

## Apply steps

```bash
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f migrations/002_seed_first_certificate.sql
```

## Validation queries

```sql
SELECT COUNT(*) AS issuers FROM qr_issuers;
SELECT COUNT(*) AS certificate_objects FROM qr_objects WHERE record_type = 'certificate';
SELECT COUNT(*) AS certificate_rows FROM qr_certificates;
SELECT COUNT(*) AS issuance_audit_rows FROM qr_audit_log WHERE event_type = 'issued';
```

Expected result for the initial seed: `1` row for each query above.
