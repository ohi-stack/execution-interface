# OneGodian Members v2.2.0 Affiliate Production Edition

Production-candidate WordPress plugin package consolidating the OneGodian Members feature line and adding a real WooCommerce affiliate attribution and commission backend.

> Production rule: code presence is not the same as production acceptance. The affiliate subsystem should be called fully operational only after the staging tests in this README pass against a real WordPress + WooCommerce installation.

## Preserved member platform features

- Member role and capability setup
- Member dashboard and login
- Certificates and digital IDs
- Protected content
- Auto-created member pages
- Conditional BuddyPress community integration
- WooCommerce entitlement boundary
- Belief Mapper, LMS, media, Galaxy, registry, certificate, dashboard, auth, and RBAC service boundaries
- App bridge and REST service inventory

## Affiliate Program v2.2.0

The affiliate program now implements the complete backend path:

`Referral link -> tracked click -> first-party attribution cookie -> WooCommerce order metadata -> commission ledger -> refund/reversal handling -> approval -> payout-status record -> affiliate dashboard/history`

### Click tracking

- Accepts `?ref=CODE` and legacy `?ogm_ref=CODE` referral parameters.
- Validates referral codes against active affiliate records.
- Stores landing URL, referring URL, UTM source, medium, campaign, and a one-way visitor hash.
- Uses a transient-based one-click-per-fingerprint-per-hour throttle to reduce duplicate/fraudulent click inflation.
- Blocks logged-in affiliates from generating tracked clicks against their own affiliate ID.

### Referral attribution

- Stores a first-party HttpOnly referral cookie with `SameSite=Lax`.
- Cookie duration is configurable from 1 to 365 days.
- Attribution model is deterministic: **last valid referral**.
- WooCommerce checkout stores affiliate ID, affiliate user ID, referral code, attribution model, and attributed timestamp in order metadata.
- A qualifying order is attributed only once.

### WooCommerce order attribution

WooCommerce is the commerce authority. The plugin does not reintroduce direct frontend Stripe checkout.

Qualifying `processing` or `completed` orders create a single commission record. Order-level uniqueness prevents duplicate commission creation when WooCommerce status hooks are replayed.

Stripe may be used only as a separately configured WooCommerce payment gateway.

### Commission calculation

Default settings:

- Commission rate: 15%
- Approval hold: 14 days
- Minimum payout: $25
- Referral cookie: 30 days

Per-affiliate commission-rate overrides are supported in the affiliate table. Developers may also use the `onegodian_affiliate_commission_rate` filter for product/category-specific or other documented commission policies.

The default eligible gross amount excludes tax and shipping. Commission amounts are calculated from the eligible gross using WooCommerce price precision.

### Commission ledger

Schema-managed tables are created for:

- affiliates
- referral clicks
- commissions
- payouts
- affiliate audit events

Commission statuses:

- pending
- approved
- rejected
- reversed
- paid

Commission records include order ID, affiliate, referral code, customer user ID, eligible gross, rate, commission amount, refund amount, hold-until date, payout reference, timestamps, and status.

### Refund and reversal handling

- Cancelled and failed orders reject unpaid commissions.
- WooCommerce refunds recalculate the payable commission proportionally.
- Full refunds reverse the commission.
- Refund adjustments are audit logged.
- Paid commissions remain subject to administrative reconciliation if a refund occurs after payout; automatic withdrawal of funds is intentionally not implemented.

### Payout approval workflow

Payout tracking is implemented without automatic funds movement.

Payout statuses:

- draft
- approved
- processing
- paid
- failed
- cancelled

Approved commissions can be grouped into a payout record when they meet the minimum payout threshold. Administrators can then track approval and paid status. Payment references/manual notes belong to the payout record. Marking a payout paid updates attached commission records to paid.

### Affiliate dashboard

`[onegodian_affiliate_dashboard]` displays authenticated affiliate metrics using the OneGodian obsidian / gold / purple card UI:

- referral link
- clicks
- attributed orders
- conversion rate
- pending commission
- approved commission
- paid commission
- payout history
- compliance notice

`[onegodian_referral_link]` displays the authenticated affiliate's unique referral URL.

Auto-created pages now include:

- `/affiliate-dashboard`
- `/affiliate-links`

### Fraud and self-referral controls

- Logged-in self-click blocking
- Order user-ID self-referral blocking
- Billing-email self-referral blocking
- Duplicate click throttling
- One commission per WooCommerce order
- Sanitized referral parameters
- Server-side validation against active affiliate records
- Audit log entries for blocked self-referrals, tracked clicks, commission creation, refund adjustment, approvals, rejections, and payouts

Additional site-specific fraud controls may be added through documented filters or external fraud/risk services.

## Affiliate administration

OneGodian Members adds admin destinations for:

- Affiliates
- Referrals
- Commissions
- Payouts
- Affiliate Settings

Commission records support approval/rejection controls and CSV export. Payout movement remains manual or external-provider-controlled; this plugin does not transfer money on its own.

## Commerce policy

WooCommerce is the authoritative checkout and order system for OneGodian Members. Direct Stripe checkout settings have been removed from the plugin admin. Stripe, if used, is a WooCommerce gateway implementation detail rather than a parallel commerce authority.

Affiliate compensation is ordinary referral/marketing compensation tied to qualifying commercial transactions. It is not equity, a security, an investment contract, a loan, or a guaranteed return.

## Service boundaries

The plugin declares and exposes boundaries for:

- Auth
- RBAC
- Dashboard
- LMS
- Belief Mapper
- Media
- Galaxy
- Registry
- Certificate / PDF / Digital ID
- WooCommerce
- Affiliate Program
- Stripe via WooCommerce only
- App Bridge
- Protected Content
- BuddyPress Community
- Auto Pages

## REST endpoints

Namespace: `onegodian-members/v1`

- `GET /status`
- `GET /services`
- `GET /dashboard`
- `GET /member/me`
- `GET /certificate`
- `GET /certificate/verify/{id}`
- `GET /entitlements`
- `GET /app-bridge`

## Shortcodes

- `[onegodian_member_dashboard]`
- `[onegodian_member_login]`
- `[onegodian_member_certificate]`
- `[onegodian_member_digital_id]`
- `[onegodian_member_community]`
- `[onegodian_affiliate_dashboard]`
- `[onegodian_referral_link]`
- `[onegodian_protected]...[/onegodian_protected]`

## Required staging acceptance tests

Before labeling the affiliate program fully operational:

1. Activate the plugin on a WordPress + WooCommerce staging site without PHP errors.
2. Confirm affiliate schema `1.0.0` is installed.
3. Create two users and verify distinct referral codes.
4. Visit a valid referral URL in a clean browser and verify the first-party cookie is created.
5. Confirm a click record is stored once for the throttled visitor fingerprint.
6. Place a WooCommerce order from a non-affiliate customer and verify order attribution metadata.
7. Move the order to processing/completed and verify exactly one pending commission record.
8. Replay the status transition and verify a second commission is not created.
9. Attempt a self-referral by user ID and by affiliate billing email; verify both are blocked.
10. Partially refund an attributed order and verify commission amount is adjusted proportionally.
11. Fully refund an attributed order and verify commission status becomes reversed.
12. Approve a commission after the configured hold policy.
13. Create a payout record from approved commissions that meet the threshold.
14. Mark the payout paid and verify the attached commissions display as paid.
15. Verify dashboard totals reconcile to the ledger.
16. Verify commission CSV export.
17. Deactivate WooCommerce and confirm OneGodian Members does not fatal; commerce surfaces should report WooCommerce unavailable.
18. Confirm no direct frontend Stripe checkout path has been reintroduced.

## Security and operations

- No API keys or payment secrets are shipped.
- Referral cookies are first-party, HttpOnly, and SameSite=Lax.
- Input is sanitized and admin state changes require capabilities and nonces.
- Affiliate events are audit logged.
- WooCommerce is conditional and commerce hooks fail closed when WooCommerce functions are unavailable.
- Payout tracking never moves funds automatically.
- Production acceptance requires live staging verification and reconciliation evidence.
