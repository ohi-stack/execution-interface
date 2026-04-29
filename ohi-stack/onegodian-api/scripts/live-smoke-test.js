#!/usr/bin/env node

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.onegodian.org';

const endpoints = [
  '/health',
  '/ready',
  '/version',
  '/api/products',
];

async function checkEndpoint(path) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  const body = await response.json();
  return { path, status: response.status, body };
}

(async () => {
  console.log(`Running live smoke test against ${API_BASE_URL}`);

  try {
    for (const endpoint of endpoints) {
      const result = await checkEndpoint(endpoint);
      console.log(`✅ ${result.path} (${result.status})`);
      console.log(JSON.stringify(result.body));
    }

    console.log('Live smoke test passed.');
  } catch (error) {
    console.error('❌ Live smoke test failed.');
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
})();
