# INO Platform WordPress Plugin

Version 0.2.0 defines the INO Platform as the complete digital operating system for the Indigenous Nation of Onegodia, not only a membership plugin.

The plugin unifies public website surfaces, member accounts, membership applications, identity and heritage preservation, BuddyPress/BuddyBoss-style community compatibility, governance, programs, volunteer management, housing, treasury and grants, learning, events, documents, certificates with QR-code verification boundaries, communications, optional marketplace, media, interactive maps, mobile/PWA capabilities, administration, integrations, reporting, security, and compliance tooling.

## Operational disclosure

Only features that are fully implemented, documented, tested, permission-controlled, and repeatable should be presented as operational. Version 0.2.0 exposes several modules as documented platform boundaries so teams can build against a unified architecture without overstating production readiness.

## Architecture

- Public website
- Member dashboard
- Administrative control panel
- API layer through REST namespace `ino-platform/v1`
- Data layer using private WordPress record post types and module metadata
- Security layer with roles, capabilities, restricted records, sanitization, and identity-review guard helpers
- Documentation and production checklist posture
- Compliance and reporting boundaries
- Deployment packaging through `scripts/package-ino-platform.sh`

## Core modules

- Public Website
- Membership
- User Accounts / Dashboard
- Identity & Heritage
- Genealogy / People’s Book of Names boundary
- Social Community
- Governance
- Programs
- Volunteers
- Housing
- Treasury & Grants
- Learning Center
- Events
- Document Center
- Certificate System
- Communications
- Optional Marketplace
- Media Center
- Interactive Maps
- Mobile Experience
- Administrative Portal
- Integrations
- Reporting & Analytics
- Forms

Identity declarations distinguish self-declared, family-attested, document-supported, institutionally reviewed, and unverified evidence levels while maintaining clear separation between ancestry, INO membership, and external governmental or tribal recognition.

## REST endpoints

- `GET /wp-json/ino-platform/v1/status` — public platform status and architecture disclosure.
- `GET /wp-json/ino-platform/v1/modules` — authenticated module schemas.
- Module-specific authenticated read-model endpoints are registered for implemented and documented-boundary modules.

## Installation

Copy `wordpress-plugins/ino-platform` into `wp-content/plugins/ino-platform`, activate **INO Platform**, then review the generated dashboard, intake, governance, programs, housing, volunteer, document, and certificate pages.

## Release package

Run:

```bash
scripts/package-ino-platform.sh
```

The 0.2.0 zip is written to `dist/ino-platform-v0.2.0.zip`.
