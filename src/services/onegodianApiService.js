const DEFAULT_TIMEOUT_MS = 4000;
const DEFAULT_OT_API_BASE = process.env.ONEGODIAN_API_BASE_URL || 'https://onegodian-api.onrender.com';

const withTimeout = async (promise, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const requestJson = async (path, { method = 'GET', body } = {}) => withTimeout(async (signal) => {
  const response = await fetch(`${DEFAULT_OT_API_BASE}${path}`, {
    method,
    headers: {
      'accept': 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
});

export const getCanonicalCurrentTime = async () => {
  const candidates = ['/v1/time/current', '/api/v1/time/current', '/v1/current', '/api/v1/current'];

  for (const path of candidates) {
    try {
      return await requestJson(path);
    } catch (_error) {
      // Try next candidate endpoint to support API deployment variations.
    }
  }

  throw new Error('Unable to fetch canonical Onegodian time from upstream API.');
};

export const convertDateTime = async (query = {}) => {
  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });

  const suffix = search.toString() ? `?${search.toString()}` : '';
  const candidates = [`/v1/time/convert${suffix}`, `/api/v1/time/convert${suffix}`, `/v1/convert${suffix}`, `/api/v1/convert${suffix}`];

  for (const path of candidates) {
    try {
      return await requestJson(path);
    } catch (_error) {
      // Try next candidate endpoint to support API deployment variations.
    }
  }

  throw new Error('Unable to fetch conversion from upstream API.');
};
