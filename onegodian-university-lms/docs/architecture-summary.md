# Onegodian University LMS Architecture (Phase 1-7 Scaffold)

## High-level architecture
- **Core bootstrap**: `onegodian-university-lms.php` initializes constants, loads classes, and wires activation/deactivation hooks.
- **Core services** (`includes/`): post types, roles, security, assets, REST routes, and DB schema creation.
- **Domain modules** (`modules/`): enrollments, courses rendering, quizzes, certificates, WooCommerce mapping, Stripe webhook abstraction, live classes, and Tutor LMS migration skeleton.
- **Presentation layer** (`public/views/`): course catalog, single course, and student dashboard templates.
- **Admin layer** (`admin/`): styles and migration admin page.

## Canonical routing policy
All frontend links in this scaffold are anchored to `https://u.onegodian.org` via `OG_LMS_Helpers::public_base_url()`.

## Initial shortcode surface
- `[og_course_catalog]`
- `[og_course id="123"]`
- `[og_lesson id="123"]`
- `[og_student_dashboard]`
- `[og_live_classes]`

## Enrollment flow
1. Student purchases a WooCommerce product mapped to `_og_course_id`.
2. On order completion, course enrollment is inserted into `wp_og_enrollments`.
3. Student sees course entries in `/dashboard` via shortcode renderer.

## Migration skeleton
The migration module adds an admin page under **Tools → Tutor Migration** with placeholders for dry-run, batches, resumability, logs, and safe reruns.
