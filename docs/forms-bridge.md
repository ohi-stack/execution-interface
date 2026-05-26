# OneGodian Forms Bridge Spec
## Frontend Routes
- /contact
- /development-inquiry
- /business-inquiry
- /community-inquiry
- /membership-inquiry
- /contributor-intake

## Admin Screens
- Forms
- Submissions
- Email Settings
- Google Sync
- Spam Protection
- Export / Logs

## Data Flow
Plugin Form -> WordPress DB -> Gmail notification -> optional Google Sheet via Apps Script webhook.

## Security
- Nonce validation on all submissions
- Sanitize all inputs
- Escape all outputs
- Honeypot and/or rate limit protection
- No secrets committed
