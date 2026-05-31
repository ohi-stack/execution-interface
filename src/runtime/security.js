const crypto = require('crypto');

const DEFAULT_JSON_LIMIT = '64kb';
const DEFAULT_PROCESS_RAW_LIMIT = Number(process.env.OMOS_PROCESS_RAW_MAX_BYTES || 16000);
const SENSITIVE_FIELD_PATTERN = /(key|secret|token|password|authorization|cookie|signature)/i;

function utcNow() {
  return new Date().toISOString();
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function configuredOrigins() {
  return [
    ...parseCsv(process.env.OMOS_ALLOWED_ORIGINS),
    ...parseCsv(process.env.OMOS_PLUGIN_ALLOWED_ORIGINS),
    ...parseCsv(process.env.CORS_ORIGIN),
    process.env.OMOS_CANONICAL_HOST,
    process.env.ONEGODIAN_APP_URL,
    process.env.ONEGODIAN_ORG_URL,
    process.env.ONEGODIAN_STORE_URL
  ].filter(Boolean);
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const allowList = configuredOrigins();
  if (allowList.length === 0) return process.env.NODE_ENV !== 'production';
  return allowList.includes(origin);
}

function requestIdMiddleware(req, res, next) {
  const inbound = req.headers['x-request-id'];
  const candidate = Array.isArray(inbound) ? inbound[0] : inbound;
  const requestId = typeof candidate === 'string' && /^[a-zA-Z0-9._:-]{8,128}$/.test(candidate)
    ? candidate
    : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-OMOS-Key, X-Request-Id');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '600');
  }

  if (req.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin(origin)) {
      return res.status(403).json({ error: 'origin_not_allowed', requestId: req.requestId });
    }
    return res.status(204).end();
  }

  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: 'origin_not_allowed', requestId: req.requestId });
  }

  return next();
}

function noStoreApiMiddleware(req, res, next) {
  if (req.path.startsWith('/api/') || req.path === '/process' || req.path === '/dashboard') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  next();
}

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      key,
      SENSITIVE_FIELD_PATTERN.test(key) ? '[redacted]' : redact(nested)
    ])
  );
}

function validateProcessInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, status: 400, error: 'invalid_input', message: 'Request body must be a JSON object' };
  }

  const raw = input.content?.raw;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { ok: false, status: 400, error: 'invalid_input', message: 'content.raw is required' };
  }

  if (Buffer.byteLength(raw, 'utf8') > DEFAULT_PROCESS_RAW_LIMIT) {
    return {
      ok: false,
      status: 413,
      error: 'payload_too_large',
      message: `content.raw must be ${DEFAULT_PROCESS_RAW_LIMIT} bytes or less`
    };
  }

  if (input.metadata !== undefined && (typeof input.metadata !== 'object' || Array.isArray(input.metadata) || input.metadata === null)) {
    return { ok: false, status: 400, error: 'invalid_input', message: 'metadata must be an object when provided' };
  }

  return { ok: true, value: input };
}

function readinessSnapshot({ version, environment, usageMap }) {
  const memory = process.memoryUsage();
  const heapUsedRatio = memory.heapTotal > 0 ? memory.heapUsed / memory.heapTotal : 0;
  const checks = [
    { name: 'runtime', status: 'ok' },
    { name: 'memory', status: heapUsedRatio < 0.9 ? 'ok' : 'degraded', heapUsedRatio: Number(heapUsedRatio.toFixed(4)) },
    { name: 'apiKeysConfigured', status: process.env.OMOS_API_KEYS ? 'ok' : 'degraded' }
  ];
  const healthy = checks.every((check) => check.status === 'ok');

  return {
    status: healthy ? 'ready' : 'degraded',
    service: 'omos-runtime',
    version,
    environment,
    timestampUtc: utcNow(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks,
    processRequests: Array.from(usageMap.values()).reduce((sum, count) => sum + count, 0)
  };
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'not_found', message: 'Route not found', requestId: req.requestId });
}

function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || (err.type === 'entity.too.large' ? 413 : 500);
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const payload = {
    error: safeStatus === 413 ? 'payload_too_large' : safeStatus >= 500 ? 'internal_error' : 'bad_request',
    message: safeStatus >= 500 ? 'Internal server error' : err.message,
    requestId: req.requestId
  };

  if (process.env.NODE_ENV !== 'production' && safeStatus >= 500) {
    payload.detail = err.message;
  }

  res.status(safeStatus).json(payload);
}

module.exports = {
  DEFAULT_JSON_LIMIT,
  requestIdMiddleware,
  corsMiddleware,
  noStoreApiMiddleware,
  redact,
  validateProcessInput,
  readinessSnapshot,
  notFoundHandler,
  errorHandler,
  utcNow
};
