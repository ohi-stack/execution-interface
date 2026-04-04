import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const mustExist = [
  'openapi/openapi.yaml',
  'governance/policy.yaml',
  'schemas/workflow-spec.schema.json',
  'schemas/task.schema.json',
  'schemas/policy-decision.schema.json',
  'schemas/audit-event.schema.json',
  'db/migrations/001_v1_enforcement.sql',
];

for (const rel of mustExist) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing required enforcement artifact: ${rel}`);
  }
}

const openapi = JSON.parse(fs.readFileSync(path.join(root, 'openapi/openapi.yaml'), 'utf8'));
const requiredPaths = ['/api/v1/records', '/api/v1/verify/{qrvid}', '/api/v1/records/{qrvid}/revoke'];
for (const p of requiredPaths) {
  if (!openapi.paths?.[p]) {
    throw new Error(`OpenAPI missing path: ${p}`);
  }
}

const statusEnum = openapi.components?.schemas?.VerifyResponse?.properties?.status?.enum || [];
const expectedStatuses = ['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND'];
for (const status of expectedStatuses) {
  if (!statusEnum.includes(status)) {
    throw new Error(`VerifyResponse.status missing enum value: ${status}`);
  }
}

JSON.parse(fs.readFileSync(path.join(root, 'governance/policy.yaml'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'schemas/policy-decision.schema.json'), 'utf8'));

console.log('Enforcement validation checks passed.');
