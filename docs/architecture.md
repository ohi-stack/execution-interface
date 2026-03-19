# QR-V Verification Portal Architecture

## Purpose

The QR-V™ Verification Portal is the public verification resolution interface for `verify.qrv.network`. It accepts QRVIDs, resolves them through `api.qrv.network`, and renders deterministic verification output for end users.

## Request flow

1. User lands on `/` and submits a QRVID, or arrives directly at `/:qrvid`.
2. Express routes the request to the verification controller.
3. The controller sanitizes the QRVID and calls `verifyQRVID(qrvid)`.
4. The verification service performs an upstream API call to `GET /verify/:qrvid`.
5. The service normalizes the response into a view-friendly model.
6. Server-rendered HTML template modules render the final response with status badge and metadata.

## Design goals

- Deterministic verification results
- Institutional and minimal user interface
- Readable and testable Node.js + Express implementation
- No frontend framework dependency
- Mobile-friendly rendering
