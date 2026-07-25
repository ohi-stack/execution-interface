# Role and capability matrix

The PHP source in `OCH_Capabilities::matrix()` is authoritative. Administrator means the custom
One Companion Administrator role; native WordPress administrators receive the same capabilities.

| Role | Capabilities |
|---|---|
| Administrator | All 23 `och_*` capabilities |
| Manager | All except `och_manage_platform_settings` |
| Care Coordinator | assigned clients, client records/profile, care plans, bookings and assignment, visit/time/incident review, documents, training, family updates, reports |
| Client | own profile/care plan, bookings, incident submission, documents, family updates, payments |
| Authorized Family Member | authorized client's profile/care plan, bookings, incident submission, documents, family updates, payments |
| Applicant | documents, training |
| Employee | availability, clock in/out, mileage, incident submission, documents, training |
| Companion / Homemaker / Driver / Handyman Provider | assigned clients/profile/care plan, availability, visit notes, clock in/out, mileage, incidents, documents, training |
| Student | documents, training |
| Instructor | documents, training |

The complete vocabulary is: `och_view_assigned_clients`, `och_view_client_profile`,
`och_manage_client_records`, `och_view_care_plan`, `och_manage_care_plans`,
`och_manage_availability`, `och_manage_bookings`, `och_assign_providers`,
`och_submit_visit_notes`, `och_review_visit_notes`, `och_clock_in`, `och_clock_out`,
`och_submit_mileage`, `och_approve_timekeeping`, `och_submit_incidents`,
`och_review_incidents`, `och_manage_documents`, `och_manage_training`,
`och_view_family_updates`, `och_manage_payments`, `och_export_reports`, and
`och_manage_platform_settings`.

Capabilities are necessary but not sufficient. `OCH_Authorization` also requires ownership, an
active family authorization, an active provider booking, assigned manager/coordinator scope, or
administrator override. All new admin actions, shortcodes, REST endpoints, exports, and downloads
must call `require_access()` before loading or disclosing a record.

> Foundation status only: this matrix does not declare any downstream workflow operational.
