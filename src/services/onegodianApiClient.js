const DEFAULT_ONEGODIAN_API_BASE_URL = 'https://api.onegodian.org';
const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

/**
 * @typedef {Object} CanonicalOtTimestamp
 * @property {string} gregorian_utc_iso
 * @property {string} ot_iso
 * @property {string} ot_day_order
 * @property {string} ot_weekday
 * @property {string} ot_month
 * @property {number} ot_day
 * @property {number} ot_year
 * @property {string} source_authority
 */

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const assertCanonicalPayload = (payload) => {
  const requiredStringFields = [
    'gregorian_utc_iso',
    'ot_iso',
    'ot_day_order',
    'ot_weekday',
    'ot_month',
    'source_authority',
  ];

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(payload?.[field])) {
      throw new Error(`Invalid canonical OT payload: missing ${field}`);
    }
  }

  if (typeof payload?.ot_day !== 'number' || typeof payload?.ot_year !== 'number') {
    throw new Error('Invalid canonical OT payload: ot_day and ot_year must be numbers');
  }

  if (!payload.source_authority.toLowerCase().includes('onegodian-api')) {
    throw new Error('Invalid canonical OT payload: non-authoritative source');
  }

  return /** @type {CanonicalOtTimestamp} */ (payload);
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const getApiBaseUrl = () =>
  process.env.ONEGODIAN_API_URL
  || DEFAULT_ONEGODIAN_API_BASE_URL;

/**
 * Resolve canonical OT representation for a Gregorian UTC ISO timestamp.
 *
 * @param {string} gregorianUtcIso
 * @returns {Promise<CanonicalOtTimestamp>}
 */
export const fetchCanonicalOtTimestamp = async (gregorianUtcIso) => {
  if (!isNonEmptyString(gregorianUtcIso)) {
    throw new Error('gregorianUtcIso is required');
  }

  const url = `${getApiBaseUrl().replace(/\/$/, '')}/v1/time/resolve`;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    body: JSON.stringify({
      gregorian_utc_iso: gregorianUtcIso,
      weekday_system: 'SUNDAY_START_FIXED',
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error('Failed to resolve canonical OT timestamp'), {
      code: 'ONEGODIAN_API_ERROR',
      statusCode: response.status,
      payload,
    });
  }

  return assertCanonicalPayload(payload);
};

export const __internal = {
  assertCanonicalPayload,
};
