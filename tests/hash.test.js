import test from 'node:test';
import assert from 'node:assert/strict';
import { createSha256Hash, toCanonicalJson } from '../src/utils/hash.js';

test('toCanonicalJson orders object keys deterministically', () => {
  const first = toCanonicalJson({ b: 2, a: 1, nested: { z: 1, y: 2 } });
  const second = toCanonicalJson({ nested: { y: 2, z: 1 }, a: 1, b: 2 });

  assert.equal(first, second);
});

test('createSha256Hash generates a 64-character digest', () => {
  const digest = createSha256Hash('qrv-registry');
  assert.equal(digest.length, 64);
});
