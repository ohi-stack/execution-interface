const { redact, utcNow } = require('./security');

function logEvent(type, payload = {}) {
  console.log(JSON.stringify({ type, payload: redact(payload), timestampUtc: utcNow() }));
}
module.exports = { logEvent };
