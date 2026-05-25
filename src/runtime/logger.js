function logEvent(type, payload = {}) {
  console.log(JSON.stringify({ type, payload, timestampUtc: new Date().toISOString() }));
}
module.exports = { logEvent };
