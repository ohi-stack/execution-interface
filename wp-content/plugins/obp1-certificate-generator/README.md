# OBP-1 Certificate Generator

## Installation
1. Copy `obp1-certificate-generator` into `wp-content/plugins`.
2. Activate plugin in WordPress admin.
3. Ensure WooCommerce is active.
4. Save permalinks once to refresh verification route.

## Configuration
1. Go to **Products** and set **OBP-1 Certificate Type** on products that should issue certificates.
2. Complete an order for that product.
3. Certificates are generated once per order/product/user combo.

## Features
- Custom DB tables: certificates, templates, events.
- WooCommerce order-complete certificate issuance.
- Verification page route: `/verify-certificate/{slug}`.
- Shortcodes:
  - `[obp1_verify_certificate]`
  - `[obp1_certificate_dashboard]`
- REST API namespace: `/wp-json/obp1/v1`.
- QR and HTML-based PDF placeholder generation in uploads folder.

## Testing
1. Activate plugin and confirm table creation.
2. Create product with certificate type meta.
3. Place and complete WooCommerce order.
4. Confirm order note and certificate row exists.
5. Visit verification URL and check only public fields.
6. Log in as customer and validate dashboard downloads.
7. Use REST endpoints as admin and public verify endpoint as guest.

## Security Notes
- Inputs sanitized and output escaped.
- Admin actions protected by capabilities/nonces.
- SQL reads use prepared statements where user input is involved.
- No private user/order/payment details on public verify page.
- Deactivation does not delete records.
