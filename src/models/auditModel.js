export const insertAuditLog = async (client, entry) => {
  const result = await client.query(
    `INSERT INTO qr_audit_log (
      id,
      qr_object_id,
      action_type,
      action_actor,
      action_details,
      created_at
    ) VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
    RETURNING *`,
    [
      entry.id,
      entry.qrObjectId,
      entry.actionType,
      entry.actionActor,
      JSON.stringify(entry.actionDetails ?? {}),
    ],
  );

  return result.rows[0];
};

export const findAuditLogsByQrvid = async (client, qrvid) => {
  const result = await client.query(
    `SELECT a.*
     FROM qr_audit_log a
     LEFT JOIN qr_objects o ON o.id = a.qr_object_id
     WHERE o.qrvid = $1
     ORDER BY a.created_at ASC`,
    [qrvid],
  );

  return result.rows;
};
