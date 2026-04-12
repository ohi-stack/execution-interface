import crypto from 'node:crypto';
import { deriveCanonicalOtDate } from './otCanonicalClient.js';

const events = new Map();

const toUtcIso = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw new Error('timestamp_utc must be a valid ISO-8601 date-time');
  }
  return date.toISOString();
};

const formatLocalTimestamp = ({ timestampUtc, timezone }) => {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return formatter.format(new Date(timestampUtc)).replace(' ', 'T');
};

const gregorianParts = ({ timestampUtc, timezone }) => {
  const date = new Date(timestampUtc);
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  });

  return {
    gregorian_date: dateFormatter.format(date),
    gregorian_weekday: weekdayFormatter.format(date),
  };
};

const deterministicId = (payload) =>
  crypto
    .createHash('sha256')
    .update(
      [
        payload.title,
        payload.timestamp_utc,
        payload.timestamp_local,
        payload.timezone,
        payload.gregorian_date,
        payload.ot_year,
        payload.ot_month_name,
        payload.ot_day,
        payload.ot_day_order_name,
        payload.source_authority,
        payload.version_standard,
      ].join('|'),
    )
    .digest('hex');

const normalizeCommonFields = async (input) => {
  const timestamp_utc = toUtcIso(input.timestamp_utc);
  const timezone = input.timezone || 'UTC';
  const timestamp_local = input.timestamp_local || formatLocalTimestamp({ timestampUtc: timestamp_utc, timezone });
  const { gregorian_date, gregorian_weekday } = gregorianParts({ timestampUtc: timestamp_utc, timezone });

  if (input.gregorian_date && input.gregorian_date !== gregorian_date) {
    throw new Error(`gregorian_date mismatch: expected ${gregorian_date}, received ${input.gregorian_date}`);
  }

  if (input.gregorian_weekday && input.gregorian_weekday !== gregorian_weekday) {
    throw new Error(`gregorian_weekday mismatch: expected ${gregorian_weekday}, received ${input.gregorian_weekday}`);
  }

  const hasOtFields = Number.isInteger(input.ot_year) && input.ot_month_name && Number.isInteger(input.ot_day) && input.ot_day_order_name;
  const otDerived = hasOtFields
    ? {
        ot_year: input.ot_year,
        ot_month_name: input.ot_month_name,
        ot_day: input.ot_day,
        ot_day_order_name: input.ot_day_order_name,
        version_standard: input.version_standard || 'onegodian-canonical/v1',
        source_authority: input.source_authority || 'onegodian-api',
      }
    : await deriveCanonicalOtDate({ timestamp_utc, timezone });

  const canonical = {
    event_id: input.event_id || '',
    title: input.title,
    description: input.description,
    timestamp_utc,
    timestamp_local,
    timezone,
    gregorian_date: input.gregorian_date || gregorian_date,
    gregorian_weekday: input.gregorian_weekday || gregorian_weekday,
    ...otDerived,
  };

  canonical.event_id = canonical.event_id || deterministicId(canonical);
  return canonical;
};

export const createHistoricalEvent = async (input) => {
  const canonical = await normalizeCommonFields(input);

  if (events.has(canonical.event_id)) {
    return {
      ok: false,
      statusCode: 409,
      error: {
        error: 'Historical event already exists',
        code: 'EVENT_CONFLICT',
        details: [`event_id ${canonical.event_id} already exists`],
        timestamp_utc: new Date().toISOString(),
      },
    };
  }

  events.set(canonical.event_id, canonical);
  return { ok: true, statusCode: 201, event: canonical };
};

const mapLegacyFields = (legacyRecord) => ({
  event_id: legacyRecord.event_id || null,
  title: legacyRecord.title || legacyRecord.event_type || 'Legacy historical event',
  description: legacyRecord.description || legacyRecord.message || 'Migrated legacy record',
  timestamp_utc: legacyRecord.timestamp_utc || legacyRecord.occurred_at_utc || legacyRecord.issued_at_utc,
  timestamp_local: legacyRecord.timestamp_local || null,
  timezone: legacyRecord.timezone || 'UTC',
  gregorian_date: legacyRecord.gregorian_date || null,
  gregorian_weekday: legacyRecord.gregorian_weekday || null,
  ot_year: legacyRecord.ot_year,
  ot_month_name: legacyRecord.ot_month_name,
  ot_day: legacyRecord.ot_day,
  ot_day_order_name: legacyRecord.ot_day_order_name,
  source_authority: legacyRecord.source_authority,
  version_standard: legacyRecord.version_standard,
});

export const migrateLegacyHistoricalRecord = async (legacyRecord) => {
  const candidate = mapLegacyFields(legacyRecord);
  return createHistoricalEvent(candidate);
};

export const listHistoricalEvents = () =>
  [...events.values()].sort((a, b) => {
    if (a.timestamp_utc === b.timestamp_utc) {
      return a.event_id.localeCompare(b.event_id);
    }
    return a.timestamp_utc.localeCompare(b.timestamp_utc);
  });

export const getHistoricalEvent = (eventId) => events.get(eventId) || null;

export const resetHistoricalEventArchive = () => {
  events.clear();
};
