# Protected Foundation Plugin Implementation Checklist

**Architecture baseline:** Protected Foundation Plugin Architecture 1.0<br>
**Repository snapshot:** `0464dca` (reviewed 2026-07-26)<br>
**Assessment type:** static source/package inventory; not production acceptance evidence

## 1. How to use this checklist

This document maps the nine protected plugins to the artifacts actually present in this repository. A checked item means that the named source artifact was found during this review; it does **not** mean the behavior passed a live WordPress test. Items marked **BLOCKER** prevent the suite or plugin from being classified as the Initial Production Release.

The review used these package rules:

- A package is **present** only when a plugin entry file or ZIP archive exists.
- A directory is a **source-package candidate**, not proof that an installable ZIP was built or tested.
- A class, table, hook, or control is **present** only when it is implemented in source, not merely named in documentation.
- Acceptance items remain unchecked until reproducible test evidence exists.
- The separate `algq-tenant-management` plugin and the Trusted Property Contact module are outside the nine-plugin protected foundation and do not substitute for a missing protected plugin.

## 2. Package reconciliation

No ZIP archives for the protected foundation are committed. Source-package candidates now exist for all nine protected plugins; installable ZIP build and live acceptance evidence remain release work.

| Load order | Protected plugin | Expected slug/package | Artifact found | Status |
|---:|---|---|---|---|
| 1 | Real Estate Platform | `algq-platform` | `plugins/algq-platform/algq-platform.php` | Source candidate; incomplete |
| 2 | Pipeline CRM | `algq-pipeline-crm` | `plugins/algq-pipeline-crm/algq-pipeline-crm.php` | Source candidate; acceptance pending |
| 3 | Deal Intake | `algq-deal-intake` | `plugins/algq-deal-intake/algq-deal-intake.php` | Source candidate; incomplete |
| 4 | MAO Engine | `algq-mao-engine` | `plugins/algq-mao-engine/algq-mao-engine.php` | Source candidate; acceptance pending |
| 5 | Document Library | `algq-document-library` | `plugins/algq-document-library/algq-document-library.php` | Source candidate; acceptance pending |
| 6 | Offer Generator | `algq-offer-generator` | `plugins/algq-offer-generator/algq-offer-generator.php` | Source candidate; acceptance pending |
| 7 | PDF & Signature Engine | `algq-pdf-signature` | `plugins/algq-pdf-signature/algq-pdf-signature.php` | Source candidate; acceptance pending |
| 8 | Automation Engine | `algq-automation-engine` | `plugins/algq-automation-engine/algq-automation-engine.php` | Source candidate; acceptance pending |
| 9 | Admin Command Center | `algq-admin-command-center` | `plugins/algq-admin-command-center/algq-admin-command-center.php` | Source candidate; acceptance pending |

> Path shorthand in this document is relative to `algonquian-real-estate/`.

## 3. Suite-wide release gate

### Packaging and metadata

- [ ] Build nine installable ZIPs with one canonical entry file per expected slug. **BLOCKER**
- [ ] Add Plugin URI, Author URI, license, minimum WordPress, minimum PHP, and network compatibility metadata to every entry file.
- [x] Existing entry files use `algq`-prefixed names and block direct access.
- [ ] Remove all release-candidate suffixes and reconcile entry-file, schema, and package versions.
- [ ] Publish checksums and a manifest tying every ZIP to a source commit.

### Bootstrap and dependencies

- [ ] Implement the platform-owned registry contract and make all eight dependent plugins declare themselves. **BLOCKER**
- [ ] Validate PHP, WordPress, platform, plugin, and schema versions before service initialization.
- [ ] Add safe admin notices for missing or incompatible dependencies.
- [ ] Load translations on `plugins_loaded` or `init`.
- [ ] Register activation, deactivation, and documented uninstall behavior for every plugin.
- [ ] Prove the Platform loads first and the Command Center degrades safely.

### Shared contracts and authority

- [ ] Implement `algq_get_deal()`, `algq_get_deal_status()`, `algq_get_underwriting_summary()`, `algq_get_document()`, `algq_log_event()`, `algq_send_mail()`, and `algq_generate_private_download()`. **BLOCKER**
- [ ] Define DTO/error/event contracts and version them independently of implementations.
- [ ] Prohibit cross-plugin private-table writes in code review and automated checks.
- [ ] Define canonical ID, idempotency-key, correlation-ID, and optimistic-lock formats.
- [ ] Move out-of-scope operational ownership from the Platform plugin or formally package it as a separate optional integration.

### Security, privacy, and operations

- [ ] Install the complete granular capability matrix and test every admin, REST, AJAX, download, preview, and export surface.
- [ ] Centralize mail, audit, private-file storage, rate limiting, secret storage, retention, and health monitoring in Platform services. **BLOCKER**
- [ ] Add versioned migrations; do not treat `dbDelta()` on activation alone as a migration system.
- [ ] Add privacy exporter/eraser integrations and retention/legal-hold controls where applicable.
- [ ] Supply unit, integration, migration, permission, nonce, REST, lifecycle, multisite, compatibility, and end-to-end evidence.
- [ ] Complete the specified seller-submission-to-audit-log acceptance transaction. **BLOCKER**

## 4. Plugin-by-plugin implementation map

## Plugin 1 — Algonquian Real Estate Platform

**Artifact:** `plugins/algq-platform/algq-platform.php`<br>
**Declared version:** 1.1.0<br>
**Current contents:** bootstrap plus Trusted Property Contact and tenant-management integration; it is not yet the protected platform service layer.

### Files/classes present

- [x] Entry file with direct-access guard.
- [x] `ALGQ_Trusted_Property_Contact_Module` module loader.
- [x] TPC database, client, property, authorization, visit, maintenance, incident, notification, report, REST, admin, and shortcode classes.
- [x] Tenant-management bridge in `includes/tenant-management-integration.php`.
- [ ] Platform registry, dependency manager, mail gateway, shared audit service, shared file service, API-contract layer, security utilities, navigation, and health-monitor classes. **BLOCKER**
- [ ] Platform activation coordinator, migration runner, deactivation coordinator, and uninstall policy.

### Storage found

The module creates 15 out-of-scope stewardship tables: `wp_algq_stewardship_clients`, `wp_algq_stewardship_properties`, `wp_algq_stewardship_authorizations`, `wp_algq_property_visits`, `wp_algq_visit_checklist_items`, `wp_algq_visit_photos`, `wp_algq_service_requests`, `wp_algq_vendor_assignments`, `wp_algq_service_estimates`, `wp_algq_service_expenses`, `wp_algq_incidents`, `wp_algq_emergency_contacts`, `wp_algq_client_messages`, `wp_algq_stewardship_documents`, and `wp_algq_stewardship_activity_log`.

- [ ] Required foundation tables `wp_algq_audit_log`, `wp_algq_mail_log`, `wp_algq_system_events`, `wp_algq_plugin_registry`, `wp_algq_migrations`, and `wp_algq_file_registry`. **BLOCKER**
- [x] TPC tables include UUID, timestamps, actor/assignee fields, status, access level, and audit version.
- [ ] TPC tables include the full standard fields (`updated_by`, soft delete, source plugin, related deal, record version) and indexed relationship columns.
- [ ] Foreign-reference integrity checks and controlled versioned migrations.

### Hooks/routes/security found

- [x] Activation and deactivation hooks.
- [x] Scheduled `algq_stewardship_daily` event.
- [x] Three `algq/v1/stewardship` REST routes with permission callbacks.
- [x] TPC-specific capabilities and access-aware property queries.
- [x] GCM encryption helper and HMAC-hashed IP logging.
- [ ] Minimum-version/dependency checks and failure notices.
- [ ] REST capability-specific callbacks, comprehensive argument validation, pagination, and rate limiting.
- [ ] Central mail gateway: TPC currently calls `wp_mail()` directly. **BLOCKER**
- [ ] Central audit/file services: the TPC activity table and attachment IDs are not substitutes.
- [ ] Page-ID registry, administrator-content preservation, authorized restoration, and WPBakery shortcode validation.
- [ ] Health checks for database, Cron, loopback, mail, files, pages, REST, dependencies, queues, signatures, and schemas.

### Release blockers

1. The protected Platform authority is substantially absent.
2. The existing plugin owns a large operational stewardship schema, conflicting with the narrow shared-infrastructure authority.
3. There is no registry through which any protected dependent plugin can declare or validate itself.
4. There is no shared mail, audit, file, migration, API-contract, or health service.
5. No automated or live production acceptance evidence is included.

## Plugin 2 — Algonquian Deal Intake

**Artifact:** `plugins/algq-deal-intake/algq-deal-intake.php`<br>
**Declared version:** 1.1.0<br>
**Current contents:** a single-class lead form and administrative list using one table.

### Files/classes present

- [x] Entry file and `ALGQ_Deal_Intake` class with direct-access guard.
- [x] Admin CSS/JavaScript, README, and changelog.
- [ ] Separate bootstrap, services, repositories, validators, duplicate detector, rate limiter, attachment service, consent service, CRM client, health check, migration, and uninstall components.

### Storage found

- [x] `wp_algq_deal_intake_leads` with contact/property summary fields and status/timestamps.
- [ ] Specified normalized submission, contact, property, file, and consent tables.
- [ ] Public UUID, created/updated users, record version, soft delete, source plugin, canonical deal reference, and indexed deduplication references.
- [ ] Schema-version option and ordered migrations.

### Hooks/shortcodes/security found

- [x] Admin save/status and authenticated/anonymous public-submit hooks.
- [x] Seven `algq_` shortcodes for the admin and seller forms.
- [x] Nonces on state-changing form handlers.
- [x] `manage_options` checks on administrative save, status, page, and shortcode paths.
- [x] Basic scalar sanitization and escaped form/list output.
- [ ] Dedicated `manage_algq_deals`/intake capabilities instead of `manage_options`.
- [ ] Server-side required-field/business validation and standardized failures.
- [ ] Honeypot, throttling/rate limiting, CAPTCHA integration, and anti-enumeration response controls. **BLOCKER**
- [ ] Upload field, MIME allowlist, size limit, malware hook, and private attachment service.
- [ ] Consent/privacy fields and immutable consent snapshot. **BLOCKER**
- [ ] Duplicate candidate scoring/review using address, email, telephone, parcel, open deal, and recency. **BLOCKER**
- [ ] UTM/referrer/campaign capture and normalized lead attribution.
- [ ] Platform audit and mail gateway calls; no seller acknowledgment is sent.
- [ ] Platform dependency declaration and health callback.
- [ ] REST API, pagination, approved filters, and material-change logging.

### Workflow/integration gaps

- [ ] Normalize a submission and generate one idempotency key.
- [ ] Call the Pipeline CRM public service exactly once to create the canonical deal. **BLOCKER**
- [ ] Record returned deal UUID/number; Intake must not become the master deal owner.
- [ ] Initialize the CRM stage and assignment through documented services.
- [ ] Queue the seller acknowledgment rather than sending it in the public request.
- [ ] Retain failed submissions safely without logging private form bodies.

### Release blockers

1. Pipeline CRM and the canonical deal-creation interface do not exist.
2. Duplicate detection, public rate limiting, consent capture, attachments, audit, and acknowledgment mail are absent.
3. The single lead table does not meet the required record or migration standard.
4. No tests demonstrate security, accessibility, mobile behavior, deduplication, or one-time deal creation.

## Plugin 3 — Algonquian Pipeline CRM

**Artifact:** `plugins/algq-pipeline-crm/algq-pipeline-crm.php` (foundation implementation; live acceptance pending)

- [x] Create the entry file, institutional metadata, protected dependency declaration, activation bootstrap, health callback, README, and initial schema.
- [ ] Add repositories, REST/admin layers, assets, migration history, lifecycle documentation, and tests.
- [ ] Create the eight specified `wp_algq_deal*` tables with canonical UUID/deal number and concurrency versioning.
- [ ] Implement stable stage keys, configurable labels/order, transition policy, loss reasons, archive/reopen audit, assignments, notes, tasks, relationships, and activity.
- [ ] Publish idempotent canonical-deal creation/read/update/transition services and events.
- [ ] Implement paginated/indexed list, Kanban, detail, timeline, task, stage-history, relationship, and archive interfaces.
- [ ] Enforce offer, contract, closing, authorization, and optimistic-lock transition rules server-side.
- [ ] Supply lifecycle, search performance, concurrent-update, deleted-assignee, permission, and canonical-ID integration evidence.

## Plugin 4 — Algonquian MAO Engine

**Artifact:** `plugins/algq-mao-engine/algq-mao-engine.php` (foundation implementation; calculation workflows and live acceptance pending)

- [x] Create the source package and declare Platform and Pipeline CRM dependencies.
- [ ] Add calculation services, repositories, admin/REST layers, migrations, lifecycle handlers, and tests.
- [ ] Create all six versioned underwriting tables.
- [ ] Implement seven strategy modes and validated currency/decimal handling.
- [ ] Version and freeze formula and assumption definitions once used.
- [ ] Persist exact inputs, outputs, user, timestamp, formula/assumption versions, approval, override authority, and override reason.
- [ ] Implement all required validation/warning cases and deterministic error contracts.
- [ ] Expose immutable approved-scenario summaries without changing CRM stages or offer records.
- [ ] Supply verified formula fixtures, boundary cases, reproducibility, permission, override, and historical-version evidence.

## Plugin 5 — Algonquian Offer Generator

**Artifact:** `plugins/algq-offer-generator/algq-offer-generator.php` (foundation implementation; offer workflows and live acceptance pending)

- [x] Create the source package and declare Platform, Pipeline CRM, and MAO dependencies.
- [ ] Add offer services, repositories, admin/REST layers, migrations, lifecycle handlers, tests, and explicit Document/PDF integrations.
- [ ] Create all six offer tables and immutable version/approval records.
- [ ] Implement ten offer types, jurisdiction metadata, template approval, safe merge rendering, and missing-field validation.
- [ ] Implement the full draft-to-withdrawn state machine with authorized approval and immutable approved versions.
- [ ] Read the selected deal and approved/identified scenario through public contracts.
- [ ] Submit approved source to PDF service and deliver only through Platform Mail.
- [ ] Preserve every delivery attempt and superseded version.
- [ ] Supply merge, amount reconciliation, approval, historical-template, delivery, and integration evidence.

## Plugin 6 — Algonquian Document Library

**Artifact:** `plugins/algq-document-library/algq-document-library.php` (foundation implementation; document workflows and live acceptance pending)

- [x] Create the source package and declare Platform as required.
- [ ] Add document services, repositories, admin/REST layers, migrations, lifecycle handlers, tests, and optional integration declarations.
- [ ] Create all eight document metadata/version/category/relationship/permission/package/request tables.
- [ ] Seed and govern the specified entity, financing, acquisition, financial-control, risk/compliance, and property-management categories.
- [ ] Implement required metadata, unique file hashes/version IDs, relationships, classifications, secure search, preview, and download authorization.
- [ ] Store bytes through Platform private-file service; do not expose upload URLs.
- [ ] Implement retention schedules, archive, destruction approval, legal hold, and immutable executed versions.
- [ ] Assemble packages from explicit immutable version IDs.
- [ ] Supply direct-access, discovery, version, package, deactivation, retention, legal-hold, and overwrite-resistance evidence.

## Plugin 7 — Algonquian PDF & Signature Engine

**Artifact:** `plugins/algq-pdf-signature/algq-pdf-signature.php` (provider-neutral interface and schema foundation; provider/render acceptance pending)

- [x] Create the source package, protected dependencies, and `ALGQ_Signature_Provider_Interface`.
- [ ] Add rendering/signature services, repositories, admin/REST layers, migrations, lifecycle handlers, tests, and an approved provider adapter.
- [ ] Create all six PDF/signature tables without duplicating Offer or Document Library metadata.
- [ ] Implement queued rendering, status/error reporting, safe CSS/templates, numbering, headers/footers, watermarks, IDs, timestamps, hashes, and immutable generated versions.
- [ ] Implement all required signature states, ordered signers, minimal provider references, and audit-certificate references.
- [ ] Validate webhook signatures/timestamps; enforce replay windows, provider event uniqueness, idempotency, retries, failure logs, and quarantine.
- [ ] Store executed-file references through Platform/Document contracts and lock completed output.
- [ ] Protect previews/downloads and export the full signature audit history.
- [ ] Supply render fixtures, cross-environment consistency, callback/replay, retry, authorization, lock, and provider-substitution evidence.

## Plugin 8 — Algonquian Automation Engine

**Artifact:** `plugins/algq-automation-engine/algq-automation-engine.php` (schema and idempotent enqueue foundation; worker acceptance pending)

- [x] Create the source package, dependency manifest, initial schema, health callback, and idempotent enqueue contract.
- [ ] Add rule/worker services, repositories, admin/REST layers, migrations, lifecycle handlers, tests, and registered event/action contracts.
- [ ] Create the five rule/version/job/attempt/dead-letter tables.
- [ ] Implement all specified trigger categories and actions through public services/hooks.
- [ ] Implement versioned rules, approval, dry/test modes, delays, priority, retry policy, attempts, recipients, and run scheduling.
- [ ] Implement durable pending/running/completed/failed/retrying/cancelled/dead-letter states and atomic locks.
- [ ] Enforce idempotency, loop detection, recursion/action ceilings, rate limits, per-rule disable, emergency pause, global kill switch, and authorized manual retry.
- [ ] Register/monitor Cron or an approved queue runner and expose queue health to Platform.
- [ ] Supply duplicate-event, crash recovery, retry/dead-letter, circular-rule, pause/resume, attribution, and cross-plugin contract evidence.

## Plugin 9 — Algonquian Admin Command Center

**Artifact:** `plugins/algq-admin-command-center/algq-admin-command-center.php` (schema/registry foundation; dashboard acceptance pending)

- [x] Create the source package with a hard Platform dependency, isolated schema, and health callback.
- [ ] Add dashboard/report services, admin/REST layers, migrations, lifecycle handlers, tests, and tolerant readers for every operational plugin.
- [ ] Create only dashboard preferences, saved reports, report jobs, and admin alerts storage.
- [ ] Define source, formula, included/excluded statuses, range, refresh, permissions, and timestamp for every KPI.
- [ ] Implement the specified executive, operational, health, and report panels with capability-aware query services.
- [ ] Implement background report jobs and authorized exports for large datasets.
- [ ] Implement health, retry, rebuild, reconcile, cache, pause/resume, schema, and storage commands through owning-plugin services.
- [ ] Require a specific capability, nonce, confirmation, and audit record for high-risk commands.
- [ ] Isolate widget/service failures so one degraded plugin cannot break the dashboard.
- [ ] Supply reconciliation, performance, unauthorized-data, export, command-audit, background-report, and degraded-plugin evidence.

## 5. Cross-plugin contract checklist

| Producer | Consumer | Required contract/event | Implementation |
|---|---|---|---|
| Intake | Pipeline | Idempotent canonical deal creation | Missing |
| Pipeline | MAO | Deal snapshot + underwriting request | Missing |
| MAO | Offer | Approved/versioned scenario summary | Missing |
| Pipeline/Offer/others | Document | Document metadata/version registration | Missing |
| Offer/Document | PDF & Signature | Immutable render source + output registration | Missing |
| PDF & Signature | Document/Pipeline | Execution status + executed-file reference | Missing |
| All operational plugins | Automation | Versioned domain events and registered actions | Missing |
| All plugins | Platform | Registry, audit, mail, file, security, health | Missing |
| All plugins | Command Center | Capability-filtered read/report/command services | Missing |

Before integration begins:

- [ ] Publish PHP interfaces and DTO schemas in Platform without importing operational implementations.
- [ ] Define event names, payload versions, ownership, delivery semantics, and idempotency behavior.
- [ ] Add contract tests ensuring hooks fire once and consumers never write producer tables.
- [ ] Add correlation IDs spanning intake, deal, scenario, offer, document, render, signature, automation, and audit records.
- [ ] Document dependency-cycle analysis: Platform must depend on none of the eight operational plugins.

## 6. Evidence required for release approval

Attach or link the following for each package version:

- [ ] ZIP filename, checksum, source commit, build command, and reproducible manifest.
- [ ] Plugin header and dependency-registry export.
- [ ] File/class inventory and generated API documentation.
- [ ] Schema snapshot, migration history, rollback/restore procedure, and test output.
- [ ] Hook/REST/Cron/capability inventories with contract versions.
- [ ] Static-analysis, coding-standard, unit, integration, permission, nonce, REST, lifecycle, compatibility, accessibility, and performance reports.
- [ ] Security review covering uploads, files, secrets, CSRF, injection, XSS, privacy, abuse controls, and logs.
- [ ] Health-check output and controlled failure/recovery drills.
- [ ] End-to-end transaction trace proving every authoritative record, version, event, mail, file, queue job, KPI, and audit entry reconciles.

## 7. Recommended remediation sequence

1. Implement the minimal Platform kernel: contracts, registry, dependency validation, migrations, capabilities, audit, mail, files, security, and health.
2. Implement Pipeline CRM as the canonical deal authority.
3. Refactor Deal Intake onto Platform services and the Pipeline creation contract; add abuse, deduplication, consent, file, and acknowledgment controls.
4. Implement MAO and Document Library independently against Platform/Pipeline contracts.
5. Implement Offer Generator against approved scenario and document contracts.
6. Implement PDF & Signature behind provider-neutral interfaces.
7. Implement Automation only after domain events and action contracts are stable.
8. Implement the tolerant Command Center last, using read models/services rather than copied records.
9. Build all ZIPs, execute the complete release gate, and retain the evidence bundle with the release manifest.

Until those items are complete, the repository must not be labeled **Algonquian Real Estate Platform — Initial Production Release**.
