const format = (level, message, meta = {}) => JSON.stringify({
  level,
  message,
  timestamp: new Date().toISOString(),
  service: process.env.SERVICE_NAME || 'execution-interface',
  ...meta,
});

export const logInfo = (message, meta) => console.log(format('info', message, meta));
export const logWarn = (message, meta) => console.warn(format('warn', message, meta));
export const logError = (message, meta) => console.error(format('error', message, meta));
