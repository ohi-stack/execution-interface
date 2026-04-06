BEGIN;

WITH issuer AS (
  INSERT INTO qr_issuers (issuer_code, issuer_name, status)
  VALUES ('QR-V', 'QR-V', 'active')
  ON CONFLICT (issuer_code)
  DO UPDATE SET issuer_name = EXCLUDED.issuer_name
  RETURNING id
),
obj AS (
  INSERT INTO qr_objects (
    qrvid,
    record_type,
    issuer_id,
    status,
    payload_hash,
    signature,
    issued_at,
    expires_at
  )
  SELECT
    'QRV-CERT-000001',
    'certificate',
    issuer.id,
    'verified',
    'sha256:seeded-first-live-certificate',
    'hmac:seeded-first-live-certificate',
    NOW(),
    NULL
  FROM issuer
  ON CONFLICT (qrvid)
  DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = NOW()
  RETURNING id
),
cert AS (
  INSERT INTO qr_certificates (
    qr_object_id,
    certificate_title,
    recipient_name,
    description,
    metadata_json
  )
  SELECT
    obj.id,
    'System Validation Certificate',
    'Production Test',
    'First live end-to-end validation',
    jsonb_build_object('seed', true)
  FROM obj
  ON CONFLICT (qr_object_id)
  DO UPDATE SET
    certificate_title = EXCLUDED.certificate_title,
    recipient_name = EXCLUDED.recipient_name,
    description = EXCLUDED.description,
    metadata_json = EXCLUDED.metadata_json
  RETURNING qr_object_id
)
INSERT INTO qr_audit_log (qr_object_id, event_type, event_data_json)
SELECT
  cert.qr_object_id,
  'issued',
  jsonb_build_object(
    'qrvid', 'QRV-CERT-000001',
    'issuer', 'QR-V',
    'recordType', 'certificate',
    'recipientName', 'Production Test',
    'certificateTitle', 'System Validation Certificate'
  )
FROM cert
WHERE NOT EXISTS (
  SELECT 1
  FROM qr_audit_log a
  WHERE a.qr_object_id = cert.qr_object_id
    AND a.event_type = 'issued'
);

COMMIT;
