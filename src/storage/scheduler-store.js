const { randomUUID } = require('crypto');
const events = new Map();
function listEvents({ from, to, status, type } = {}) { let results = Array.from(events.values()); if (from) results = results.filter((e) => e.timestamp_utc >= from); if (to) results = results.filter((e) => e.timestamp_utc <= to); if (status) results = results.filter((e) => e.status === status); if (type) results = results.filter((e) => e.type === type); return results; }
function getEvent(id) { return events.get(id); }
function createEvent(data) { const id = `evt_${randomUUID()}`; const now = new Date().toISOString(); const record = { id, title: data.title, description: data.description || '', type: data.type || 'standard', status: data.status || 'scheduled', timestamp_utc: data.timestamp_utc, timestamp_local: data.timestamp_local, timezone: data.timezone, duration_minutes: data.duration_minutes || 60, price_usd: data.price_usd || 0, payment_status: data.price_usd > 0 ? 'pending' : 'not_required', created_at_utc: now, updated_at_utc: now, metadata: data.metadata || {} }; events.set(id, record); return record; }
function updateEvent(id, data) { const existing = events.get(id); if (!existing) return null; const updated = { ...existing, ...data, updated_at_utc: new Date().toISOString() }; events.set(id, updated); return updated; }
function deleteEvent(id) { return events.delete(id); }
module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent };
