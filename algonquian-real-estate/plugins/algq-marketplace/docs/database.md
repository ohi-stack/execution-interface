# Database

The activation routine creates four WordPress-prefixed tables:

- `algq_marketplace_buyer_offers`: buyer interest and offer submissions.
- `algq_marketplace_nda_acceptances`: NDA signer records with deal/user references.
- `algq_marketplace_access_logs`: marketplace access audit records.
- `algq_marketplace_activity_log`: operational audit events.

Tables are removed only when the uninstall cleanup setting `cleanup_tables` is enabled.
