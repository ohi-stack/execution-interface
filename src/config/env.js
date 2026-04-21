const isProd = (process.env.NODE_ENV || 'development') === 'production';

const requiredInProd = ['JWT_SECRET', 'SIGNING_SECRET'];
if (isProd) {
  for (const key of requiredInProd) {
    if (!process.env[key]) {
      console.error(`[startup] missing required env var in production: ${key}`);
    }
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  VERIFY_BASE_URL: process.env.VERIFY_BASE_URL || process.env.BASE_URL || 'http://localhost:3000',
  ISSUER_NAME: process.env.ISSUER_NAME || 'ONEGODIAN, LLC',
  SIGNING_SECRET: process.env.SIGNING_SECRET || 'demo-secret',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
};

