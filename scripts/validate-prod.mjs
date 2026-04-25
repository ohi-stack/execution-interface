const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'QRV_API_KEYS',
  'QRV_SIGNING_SECRET',
  'QRV_JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SERVICE_NAME',
];

const missing = required.filter((name) => !(process.env[name] || '').trim());
if ((process.env.NODE_ENV || '').toLowerCase() !== 'production') {
  console.error('NODE_ENV must be production for validate:prod');
  process.exit(1);
}

if (missing.length > 0) {
  console.error(`Missing required production environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

if (!((process.env.QRV_BACKUP_DIR || process.env.QRV_BACKUP_SCHEDULE || '').trim())) {
  console.warn('Warning: backup path/schedule not configured (set QRV_BACKUP_DIR or QRV_BACKUP_SCHEDULE).');
}

console.log('Production environment validation passed.');
