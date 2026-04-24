export const buildErrorResponse = ({
  error,
  code,
  details = [],
  obligations,
  statusCode,
}) => {
  const payload = {
    error,
    code,
    details: Array.isArray(details) ? details : [String(details)],
    timestamp_utc: new Date().toISOString(),
  };

  if (obligations) {
    payload.obligations = obligations;
  }

  return statusCode ? { statusCode, body: payload } : payload;
};
