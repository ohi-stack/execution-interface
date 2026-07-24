# INO Pequot Street Redevelopment & Preservation

Initial WordPress plugin scaffold for the Pequot Street Redevelopment & Preservation Project module.

## Features

- INO-branded public WPBakery/Visual Composer-compatible shortcode: `[ino_pequot_project]`.
- Sixteen supporting project page cards: overview, history, housing, preservation, parcels, GIS, surveys, documents, timeline, legal notices, easements, community, forms, media, FAQ, and contact.
- Housing and development admin menu with manifest output.
- Custom record types for GIS parcel records, surveys, documents, timeline records, and legal notices.
- Placeholders for image, video, map, document, and workflow content.
- OneGodian Forms Bridge workflow names for interest, survey, document intake, and legal-notice acknowledgement flows.
- Role-based capabilities plus an `ino_housing_reviewer` read-only role.
- REST endpoints: `/wp-json/ino-pequot/v1/health` and `/wp-json/ino-pequot/v1/manifest`.
- Legally disciplined easement and title disclaimer language.

## Production checklist

1. Replace placeholders with approved images, embedded videos, maps, and recorded document references.
2. Review all easement, title, boundary, and legal notice copy with counsel and title/survey professionals.
3. Map OneGodian Forms Bridge workflow IDs to production forms.
4. Confirm role assignments for administrators, editors, housing reviewers, and external reviewers.
5. Test WPBakery rendering, REST routes, custom post type access, and noindex/public visibility policy.
