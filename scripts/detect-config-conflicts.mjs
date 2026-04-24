const checks = [
  {
    name: 'API base URL',
    keys: ['NEXT_PUBLIC_API_URL', 'API_BASE_URL', 'QRV_API_BASE_URL'],
  },
  {
    name: 'CORS origins',
    keys: ['CORS_ORIGINS', 'CORS_ORIGIN', 'ALLOWED_ORIGINS'],
  },
];

let hasConflict = false;

for (const check of checks) {
  const entries = check.keys
    .map((key) => [key, process.env[key]])
    .filter(([, value]) => value !== undefined && value !== '');

  if (entries.length <= 1) continue;

  const distinctValues = new Set(entries.map(([, value]) => value));
  if (distinctValues.size > 1) {
    hasConflict = true;
    console.error(`Conflict detected for ${check.name}:`);
    entries.forEach(([key, value]) => console.error(`- ${key}=${value}`));
  }
}

if (hasConflict) {
  process.exit(1);
}

console.log('No env conflicts detected for known key groups.');
