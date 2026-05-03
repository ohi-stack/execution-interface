# OneGodian App Structure Standard

This is the baseline production structure for every OneGodian app, plugin, module, and bridge.

Every OneGodian app must be usable in three ways:

1. Public-facing page
2. Logged-in dashboard
3. Admin/control panel

## 1. Public App Layer

Required items:

- Homepage or module landing page
- About or purpose page
- Feature overview
- Public documentation
- Pricing or access level, if applicable
- Contact or support call to action

## 2. Dashboard Layer

Required items:

- Main dashboard
- System status cards
- Quick actions
- Recent activity
- User/member profile
- Notifications
- Module navigation

## 3. Admin Layer

Required items:

- Admin dashboard
- Settings panel
- API/app bridge settings
- Key generation and rotation
- User/member management
- Submission management
- Production checklist
- Logs and audit trail

## 4. API / Bridge Layer

Required items:

- Health endpoint
- Manifest endpoint
- Tool list endpoint
- Stats endpoint
- Secure REST endpoints
- `X-OMOS-App-Key` support
- Environment variable panel
- Webhook support where needed

## 5. Data Layer

Required items:

- Database schema
- Submissions table
- Users/members table
- Settings table
- Logs table
- Certificates/records table, if applicable
- Export/import support

## 6. Security Layer

Required items:

- App key authentication
- Role-based permissions
- Nonce / CSRF protection
- Input validation
- Rate limiting
- Audit logging
- Secure Stripe/payment fallback where applicable

## 7. UI / UX Layer

Required items:

- Consistent OneGodian branding
- Admin cards and status badges
- Sidebar navigation
- Mobile-responsive layout
- Icons for every module
- Empty states
- Success/error notices
- Production readiness indicators

## 8. Documentation Layer

Required items:

- README
- Installation guide
- Environment variable guide
- API endpoint documentation
- Admin usage guide
- Production checklist
- Changelog
- Version history

## 9. Compliance Layer

Required items:

- Terms notice
- Privacy notice
- Contributor/user disclaimer
- Financial disclaimer if money is involved
- Membership terms if users join
- Intellectual property notice
- Legal-safe public language

## 10. Deployment Layer

Required items:

- `.env.example`
- Build/test scripts
- Syntax/lint checks
- Version number
- GitHub-ready structure
- Hostinger/Vercel/WordPress deployment notes
- Rollback instructions

## Required Core Pages

Every OneGodian app should include or intentionally map these routes:

```txt
/dashboard
/ecosystem
/registry
/tools
/members
/certificates
/products
/media
/settings
/admin
/api/health
/api/manifest
/api/tools
/api/stats
```

## Required Plugin/Admin Screens

Every OneGodian plugin or bridge should include these admin/control screens:

- App Bridge
- Dashboard
- Settings
- API Keys
- Submissions
- Tools
- Status
- Production Checklist
- Documentation

## Production Gate

A OneGodian app, plugin, module, or bridge should not be treated as production-ready unless the following are true:

- The public app layer is reachable.
- The logged-in dashboard layer is usable.
- The admin/control panel exists.
- Health, manifest, tools, and stats endpoints are available.
- Authentication, permissions, validation, and logging are implemented.
- Documentation, environment variables, and deployment notes are included.
- Compliance notices are present when the app involves members, money, data collection, certificates, submissions, or regulated claims.
