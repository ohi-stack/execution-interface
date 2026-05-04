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

function verifyApiKey(apiKey) {
  const hashed = hashApiKey(apiKey);
  if (!hashed) return null;

  return parseConfiguredKeys().find((entry) => entry.hash === hashed) || null;
}

module.exports = {
  generateApiKey,
  hashApiKey,
  verifyApiKey
};
