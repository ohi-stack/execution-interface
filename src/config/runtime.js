const requiredProductionVars = [
  'QRV_API_KEYS',
  'QRV_SIGNING_SECRET',
  'QRV_JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

export const backupConfigured = () => Boolean((process.env.QRV_BACKUP_DIR || process.env.QRV_BACKUP_SCHEDULE || '').trim());

export const validateRuntimeEnv = () => {
  if ((process.env.NODE_ENV || '').toLowerCase() !== 'production') return;

  const missing = requiredProductionVars.filter((key) => !(process.env[key] || '').trim());
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
};
