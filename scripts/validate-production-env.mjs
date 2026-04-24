const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'QRV_SIGNING_SECRET',
  'QRV_ISSUER_KEYS',
  'ADMIN_API_KEY',
  'CORS_ORIGINS',
  'NEXT_PUBLIC_API_URL',
];

const problems = [];

for (const key of required) {
  if (!process.env[key]) {
    problems.push(`${key} is required`);
  }
}

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  problems.push('NODE_ENV must be production in deploy environments');
}

const urlKeys = ['NEXT_PUBLIC_API_URL', 'API_BASE_URL', 'QRV_API_BASE_URL', 'QRV_VERIFY_URL', 'QRV_ISSUER_URL', 'QRV_REGISTRY_URL'];
for (const key of urlKeys) {
  const value = process.env[key];
  if (!value) continue;

  if (/\r|\n/.test(value)) {
    problems.push(`${key} contains newline characters`);
    continue;
  }

  try {
    new URL(value);
  } catch {
    problems.push(`${key} is not a valid URL`);
  }
}

if (process.env.CORS_ORIGINS) {
  const origins = process.env.CORS_ORIGINS.split(',').map((v) => v.trim()).filter(Boolean);
  if (origins.length === 0) {
    problems.push('CORS_ORIGINS is empty');
  }
  origins.forEach((origin) => {
    try {
      new URL(origin);
    } catch {
      problems.push(`CORS_ORIGINS entry is invalid: ${origin}`);
    }
  });
}

if (problems.length > 0) {
  console.error('Production environment validation failed:');
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log('Production environment validation passed.');
