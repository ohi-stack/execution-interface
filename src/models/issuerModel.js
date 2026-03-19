export const insertIssuer = async (client, issuer) => {
  const result = await client.query(
    `INSERT INTO qr_issuers (
      id,
      issuer_name,
      issuer_code,
      issuer_status,
      website_url,
      contact_email,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *`,
    [
      issuer.id,
      issuer.issuerName,
      issuer.issuerCode,
      issuer.issuerStatus,
      issuer.websiteUrl,
      issuer.contactEmail,
    ],
  );

  return result.rows[0];
};

export const findIssuerById = async (client, issuerId) => {
  const result = await client.query('SELECT * FROM qr_issuers WHERE id = $1', [issuerId]);
  return result.rows[0] ?? null;
};
