import fs from 'node:fs';
import path from 'node:path';

const outDir = process.env.QRV_EXPORT_DIR || 'artifacts/exports';
fs.mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputPath = path.join(outDir, `qrv-export-${stamp}.json`);

const payload = {
  generated_at_utc: new Date().toISOString(),
  records: JSON.parse(process.env.QRV_RECORDS_JSON || '[]'),
  audit_events: JSON.parse(process.env.QRV_AUDIT_EVENTS_JSON || '[]'),
  issuers: JSON.parse(process.env.QRV_ISSUERS_JSON || '[]'),
};

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`QRV export written to ${outputPath}`);
