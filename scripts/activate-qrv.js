#!/usr/bin/env node

/**
 * QR-V Activation Script
 * Forces: ISSUE → QR → SCAN → VERIFY
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const VERIFY_BASE = process.env.VERIFY_BASE || 'https://verify.qrv.network';
const LOCAL_VERIFY = `${API_BASE}/api/v1/verify`;

const OUTPUT_DIR = path.join(process.cwd(), 'qrcodes');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const nowUtc = () => new Date().toISOString();

const metadataHash = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

const buildCreatePayload = () => {
  const metadata = {
    type: 'activation-test',
    note: 'First verified record',
    created_at_utc: nowUtc(),
  };

  const suffix = Date.now().toString().slice(-8);

  return {
    qrvid: `QRV-ACT-${suffix}`,
    issuer: 'ONEGODIAN',
    subject: 'First Live QR-V Record',
    issued_at_utc: nowUtc(),
    metadata_hash: metadataHash(metadata),
  };
};

async function issueRecord() {
  console.log('\n🚀 Issuing QR-V record...\n');

  const payload = buildCreatePayload();

  try {
    const response = await fetch(`${API_BASE}/api/v1/records`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-actor-role': 'issuer',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    if (!data?.qrvid) {
      throw new Error('Invalid response: missing qrvid');
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to issue record');
    console.error(error.message);
    process.exit(1);
  }
}

function buildVerifyURL(qrvid) {
  const publicUrl = `${VERIFY_BASE}/${qrvid}`;
  const localUrl = `${LOCAL_VERIFY}/${qrvid}`;

  return { publicUrl, localUrl };
}

async function generateQR(qrvid, url) {
  const filePath = path.join(OUTPUT_DIR, `${qrvid}.png`);
  const qrServiceUrl = `https://quickchart.io/qr?size=400&text=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(qrServiceUrl);
    if (!response.ok) {
      throw new Error(`QR service returned ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error('❌ QR generation failed', error.message);
    process.exit(1);
  }
}

async function verifyCheck(url) {
  console.log('\n🔍 Checking verification endpoint...\n');

  try {
    const response = await fetch(url);
    const data = await response.json().catch(() => ({}));

    console.log('Verification Response:');
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (_error) {
    console.warn('⚠️ Verify request failed (may still work in browser)');
    return null;
  }
}

const openUrl = async (url) => {
  const platform = process.platform;
  const command = platform === 'darwin'
    ? `open "${url}"`
    : platform === 'win32'
      ? `start "" "${url}"`
      : `xdg-open "${url}"`;

  return new Promise((resolve) => {
    exec(command, () => resolve());
  });
};

(async () => {
  console.log('\n==============================');
  console.log('QR-V ACTIVATION SEQUENCE');
  console.log('==============================\n');

  const record = await issueRecord();
  const { qrvid } = record;

  console.log(`✅ Record issued: ${qrvid}`);

  const { publicUrl, localUrl } = buildVerifyURL(qrvid);

  console.log('\n🌐 Verification URLs:');
  console.log(`Public: ${publicUrl}`);
  console.log(`Local : ${localUrl}`);

  const qrPath = await generateQR(qrvid, publicUrl);

  console.log(`\n🧾 QR Code saved: ${qrPath}`);

  await verifyCheck(localUrl);

  console.log('\n🌍 Opening verification page...\n');
  await openUrl(publicUrl);

  console.log('==============================');
  console.log('📱 SCAN THE QR CODE NOW');
  console.log('==============================\n');

  console.log(`QR File: ${qrPath}`);
  console.log('Expected: VERIFIED\n');
})();
