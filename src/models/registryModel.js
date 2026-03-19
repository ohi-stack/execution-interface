export const insertQrObject = async (client, objectRecord) => {
  const result = await client.query(
    `INSERT INTO qr_objects (
      id,
      qrvid,
      record_type,
      object_status,
      issuer_id,
      subject_name,
      asset_name,
      description,
      hash_value,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    RETURNING *`,
    [
      objectRecord.id,
      objectRecord.qrvid,
      objectRecord.recordType,
      objectRecord.objectStatus,
      objectRecord.issuerId,
      objectRecord.subjectName,
      objectRecord.assetName,
      objectRecord.description,
      objectRecord.hashValue,
    ],
  );

  return result.rows[0];
};

export const insertCertificate = async (client, certificate) => {
  const result = await client.query(
    `INSERT INTO qr_certificates (
      id,
      qr_object_id,
      certificate_number,
      issued_to,
      issued_date,
      expiry_date,
      metadata,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW(), NOW())
    RETURNING *`,
    [
      certificate.id,
      certificate.qrObjectId,
      certificate.certificateNumber,
      certificate.issuedTo,
      certificate.issuedDate,
      certificate.expiryDate,
      JSON.stringify(certificate.metadata ?? {}),
    ],
  );

  return result.rows[0];
};

export const insertHashRecord = async (client, hashRecord) => {
  const result = await client.query(
    `INSERT INTO qr_hash_registry (
      id,
      qr_object_id,
      hash_algorithm,
      hash_value,
      hash_status,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *`,
    [
      hashRecord.id,
      hashRecord.qrObjectId,
      hashRecord.hashAlgorithm,
      hashRecord.hashValue,
      hashRecord.hashStatus,
    ],
  );

  return result.rows[0];
};

export const findRegistryRecordByQrvid = async (client, qrvid) => {
  const result = await client.query(
    `SELECT 
        o.*, 
        i.issuer_name,
        i.issuer_code,
        i.issuer_status,
        i.website_url,
        i.contact_email,
        c.id AS certificate_id,
        c.certificate_number,
        c.issued_to,
        c.issued_date,
        c.expiry_date,
        c.metadata,
        h.hash_algorithm,
        h.hash_status,
        h.created_at AS hash_created_at
      FROM qr_objects o
      LEFT JOIN qr_issuers i ON i.id = o.issuer_id
      LEFT JOIN LATERAL (
        SELECT * FROM qr_certificates qc
        WHERE qc.qr_object_id = o.id
        ORDER BY qc.created_at DESC
        LIMIT 1
      ) c ON TRUE
      LEFT JOIN LATERAL (
        SELECT * FROM qr_hash_registry qh
        WHERE qh.qr_object_id = o.id
        ORDER BY qh.created_at DESC
        LIMIT 1
      ) h ON TRUE
      WHERE o.qrvid = $1`,
    [qrvid],
  );

  return result.rows[0] ?? null;
};

export const updateRegistryStatusByQrvid = async (client, qrvid, objectStatus) => {
  const result = await client.query(
    `UPDATE qr_objects
     SET object_status = $2,
         updated_at = NOW()
     WHERE qrvid = $1
     RETURNING *`,
    [qrvid, objectStatus],
  );

  return result.rows[0] ?? null;
};
