import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';

export async function listEvents(filters = {}) {
  let sql = 'SELECT * FROM scheduler_events WHERE 1=1';
  const params = [];

  if (filters.from) {
    params.push(filters.from);
    sql += ` AND timestamp_utc >= $${params.length}`;
  }

  if (filters.to) {
    params.push(filters.to);
    sql += ` AND timestamp_utc <= $${params.length}`;
  }

  if (filters.status) {
    params.push(filters.status);
    sql += ` AND status = $${params.length}`;
  }

  const res = await query(sql, params);
  return res.rows;
}

export async function getEvent(id) {
  const res = await query(
    'SELECT * FROM scheduler_events WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function createEvent(data) {
  const id = `evt_${uuidv4()}`;

  const res = await query(`
    INSERT INTO scheduler_events (
      id, title, description, type, status,
      timestamp_utc, timestamp_local, timezone,
      duration_minutes, price_usd, payment_status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `, [
    id,
    data.title,
    data.description || '',
    data.type || 'standard',
    data.status || 'scheduled',
    data.timestamp_utc,
    data.timestamp_local,
    data.timezone,
    data.duration_minutes || 60,
    data.price_usd || 0,
    data.price_usd > 0 ? 'pending' : 'not_required'
  ]);

  return res.rows[0];
}

export async function updateEvent(id, data) {
  const res = await query(`
    UPDATE scheduler_events
    SET title=$2, description=$3, updated_at_utc=NOW()
    WHERE id=$1
    RETURNING *
  `, [id, data.title, data.description]);

  return res.rows[0];
}

export async function deleteEvent(id) {
  await query('DELETE FROM scheduler_events WHERE id=$1', [id]);
  return true;
}
