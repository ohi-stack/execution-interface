const crypto = require('crypto');

function generateApiKey() {
  return `omos_live_${crypto.randomBytes(24).toString('hex')}`;
}

function hashApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return null;
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

function parseConfiguredKeys() {
  const raw = process.env.OMOS_API_KEYS || '';
  if (!raw) return [];

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hash, plan] = entry.split(':');
      return { name, hash, plan: (plan || 'starter').toLowerCase() };
    })
    .filter((entry) => entry.name && entry.hash);
}

function safeEqualHex(a, b) {
  if (!/^[a-f0-9]{64}$/i.test(a || '') || !/^[a-f0-9]{64}$/i.test(b || '')) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

function verifyApiKey(apiKey) {
  const hashed = hashApiKey(apiKey);
  if (!hashed) return null;

  return parseConfiguredKeys().find((entry) => safeEqualHex(entry.hash, hashed)) || null;
}

module.exports = {
  generateApiKey,
  hashApiKey,
  verifyApiKey
};
