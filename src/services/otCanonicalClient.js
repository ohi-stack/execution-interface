let customDerivationResolver = null;

const requireUtcTimestamp = (timestampUtc) => {
  const date = new Date(timestampUtc);
  if (!timestampUtc || Number.isNaN(date.getTime()) || !/Z$/.test(timestampUtc)) {
    throw new Error('timestamp_utc must be an ISO-8601 UTC date-time');
  }
};

const normalizeOtResult = (result) => {
  if (!result || typeof result !== 'object') {
    throw new Error('OT derivation result must be an object');
  }

  if (!Number.isInteger(result.ot_year)) {
    throw new Error('OT derivation result missing ot_year');
  }

  if (!result.ot_month_name || !result.ot_day_order_name || !Number.isInteger(result.ot_day)) {
    throw new Error('OT derivation result missing OT month/day metadata');
  }

  return {
    ot_year: result.ot_year,
    ot_month_name: result.ot_month_name,
    ot_day: result.ot_day,
    ot_day_order_name: result.ot_day_order_name,
    version_standard: result.version_standard || 'onegodian-canonical/v1',
    source_authority: result.source_authority || 'onegodian-api',
  };
};

const deriveViaOnegodianApi = async ({ timestamp_utc, timezone }) => {
  const baseUrl = process.env.ONEGODIAN_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('ONEGODIAN_API_BASE_URL is required when OT resolver is not injected');
  }

  const url = new URL('/v1/calendar/derive', baseUrl);
  url.searchParams.set('timestamp_utc', timestamp_utc);
  url.searchParams.set('timezone', timezone);

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`onegodian-api OT derivation failed with status ${response.status}`);
  }

  const payload = await response.json();
  return normalizeOtResult(payload);
};

export const setOtDerivationResolver = (resolver) => {
  customDerivationResolver = resolver;
};

export const deriveCanonicalOtDate = async ({ timestamp_utc, timezone }) => {
  requireUtcTimestamp(timestamp_utc);

  if (!timezone || typeof timezone !== 'string') {
    throw new Error('timezone must be provided');
  }

  if (customDerivationResolver) {
    const customResult = await customDerivationResolver({ timestamp_utc, timezone });
    return normalizeOtResult(customResult);
  }

  return deriveViaOnegodianApi({ timestamp_utc, timezone });
};
