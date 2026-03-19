import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQrvid } from '../src/utils/qrvid.js';

test('generateQrvid produces a QRV-prefixed identifier', () => {
  const qrvid = generateQrvid();

  assert.match(qrvid, /^QRV-\d{14}-[A-F0-9]{8}$/);
});
