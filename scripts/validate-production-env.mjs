const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'QRV_SIGNING_SECRET',
  'QRV_ISSUER_KEYS',
  'ADMIN_API_KEY',
];

const problems = [];
const warnings = [];

for (const key of required) {
  if (!process.env[key]) {
    problems.push(`${key} is required`);
  }
}

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  problems.push('NODE_ENV must be production in deploy environments');
}

const corsSources = [process.env.CORS_ORIGINS, process.env.CORS_ORIGIN, process.env.ALLOWED_ORIGINS].filter(Boolean);
if (corsSources.length === 0) {
  problems.push('One of CORS_ORIGINS, CORS_ORIGIN, or ALLOWED_ORIGINS must be set');
}
if (new Set(corsSources).size > 1) {
  warnings.push('Multiple CORS variables have different values; CORS_ORIGINS takes precedence');
}

const resolvedCors = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || process.env.ALLOWED_ORIGINS || '';
const origins = resolvedCors.split(',').map((v) => v.trim()).filter(Boolean);
if (origins.length === 0) {
  problems.push('Resolved CORS origins are empty');
}
origins.forEach((origin) => {
  try {
    new URL(origin);
  } catch {
    problems.push(`Invalid CORS origin: ${origin}`);
  }
});

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

const apiBases = [process.env.NEXT_PUBLIC_API_URL, process.env.API_BASE_URL, process.env.QRV_API_BASE_URL].filter(Boolean);
if (new Set(apiBases).size > 1) {
  warnings.push('API base URL variables differ; NEXT_PUBLIC_API_URL > API_BASE_URL > QRV_API_BASE_URL precedence applies');
}

if (warnings.length > 0) {
  console.warn('Production environment warnings:');
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (problems.length > 0) {
  console.error('Production environment validation failed:');
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log('Production environment validation passed.');
