const requiredInProduction = ['QRV_SIGNING_SECRET', 'QRV_ISSUER_KEYS'];

export const validateEnvironment = () => {
  const missing = requiredInProduction.filter((key) => !process.env[key]);

  if (process.env.NODE_ENV === 'production' && missing.length > 0) {
    throw Object.assign(new Error(`Missing required environment variables: ${missing.join(', ')}`), {
      code: 'ENV_VALIDATION_FAILED',
      missing,
    });
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    issuerAuthConfigured: Boolean(process.env.QRV_ISSUER_KEYS),
    signingConfigured: Boolean(process.env.QRV_SIGNING_SECRET),
  };
};
