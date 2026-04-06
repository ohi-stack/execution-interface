# First live scan execution checklist

Deployment order:

1. Deploy `qrv-registry`.
2. Deploy `qrv-api`.
3. Test API directly.
4. Deploy `qrv-node`.
5. Test public verify page.
6. Deploy `issuer-qrv`.
7. Issue first live certificate.
8. Scan QR.
9. Confirm `VERIFIED` result.

First live test record:

- Issuer: `QR-V`
- Record Type: `certificate`
- Recipient: `Production Test`
- Certificate Title: `System Validation Certificate`
- Description: `First live end-to-end validation`
- QRVID target: `QRV-CERT-000001`

Final acceptance chain:

1. Form submit succeeds.
2. DB row exists.
3. API verify returns JSON.
4. Public verify page loads.
5. QR code scans to that page.
6. Page displays `VERIFIED`.
