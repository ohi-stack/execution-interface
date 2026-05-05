const events = new Map();

export async function listEvents(filters = {}) {
  let all = Array.from(events.values());
  if (filters.from) all = all.filter((e) => new Date(e.timestamp_utc) >= new Date(filters.from));
  if (filters.to) all = all.filter((e) => new Date(e.timestamp_utc) <= new Date(filters.to));
  if (filters.status) all = all.filter((e) => e.status === filters.status);
  return all;
}

export async function getEvent(id) {
  return events.get(id);
}

export async function createEvent(data) {
  const id = `evt_mem_${Date.now()}`;
  const now = new Date().toISOString();
  const row = {
const { v4: uuidv4 } = require('uuid');

const events = new Map();

function listEvents(filters = {}) {
  const rows = Array.from(events.values());

  return rows.filter((event) => {
    if (filters.from && new Date(event.timestamp_utc) < new Date(filters.from)) return false;
    if (filters.to && new Date(event.timestamp_utc) > new Date(filters.to)) return false;
    if (filters.status && event.status !== filters.status) return false;
    return true;
  });
}

function getEvent(id) {
  return events.get(id);
}

function createEvent(data) {
  const id = `evt_${uuidv4()}`;
  const now = new Date().toISOString();
  const event = {
    id,
    title: data.title,
    description: data.description || '',
    type: data.type || 'standard',
    status: data.status || 'scheduled',
    timestamp_utc: data.timestamp_utc,
    timestamp_local: data.timestamp_local,
    timezone: data.timezone,
    duration_minutes: data.duration_minutes || 60,
    price_usd: data.price_usd || 0,
    payment_status: data.price_usd > 0 ? 'pending' : 'not_required',
    created_at_utc: now,
    updated_at_utc: now,
    metadata: data.metadata || {}
  };
  events.set(id, row);
  return row;
}

export async function updateEvent(id, data) {
  const existing = events.get(id);
  if (!existing) return null;

  events.set(id, event);
  return event;
}

function updateEvent(id, data) {
  const existing = events.get(id);
  if (!existing) return undefined;

  const updated = {
    ...existing,
    ...data,
    updated_at_utc: new Date().toISOString()
  };

  events.set(id, updated);
  return updated;
}

function deleteEvent(id) {
export async function deleteEvent(id) {
  return events.delete(id);
}
async function deleteEvent(id) {
  return events.delete(id);
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent };
