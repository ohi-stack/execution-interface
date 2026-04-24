import test from 'node:test';
import assert from 'node:assert/strict';
import {
  __setRecordRepositoryForTests,
  createRecord,
  resetRecordStore,
  revokeRecord,
  verifyRecord,
} from '../src/services/recordStore.js';

const createMockAdapter = () => {
  const store = new Map();
  const audits = [];
  return {
    audits,
    async createRecord(record) {
      if (store.has(record.qrvid)) return { ok: false, code: 'QRVID_CONFLICT' };
      store.set(record.qrvid, { ...record });
      return { ok: true };
    },
    async getByQrvid(qrvid) {
      return store.get(qrvid) || null;
    },
    async updateRecord(record) {
      store.set(record.qrvid, { ...record });
    },
    async revokeRecord(qrvid, { revokedAt }) {
      const record = store.get(qrvid);
      if (!record) return { ok: false, code: 'NOT_FOUND' };
      record.status = 'REVOKED';
      record.revokedAt = revokedAt;
      store.set(qrvid, record);
      return { ok: true, record };
    },
    async listIssuerRecords(issuer) {
      return [...store.values()].filter((record) => record.issuer === issuer);
    },
    async writeAudit(audit) {
      audits.push(audit);
    },
    reset() {
      store.clear();
      audits.length = 0;
    },
  };
};

test.beforeEach(() => {
  const mock = createMockAdapter();
  __setRecordRepositoryForTests(mock);
  resetRecordStore();
});

test('mock adapter create/verify/revoke lifecycle works', async () => {
  const created = await createRecord({
    qrvid: 'QRV-PG-TEST-0001',
    recipient: 'Pilot Recipient',
    subject: 'Pilot Subject',
    title: 'Pilot Title',
    issuer: 'issuer-qrv',
    issueDate: '2026-04-24T00:00:00Z',
  });
  assert.equal(created.ok, true);

  const verified = await verifyRecord('QRV-PG-TEST-0001');
  assert.equal(verified.statusCode, 200);
  assert.equal(verified.verification.status, 'VERIFIED');

  await revokeRecord('QRV-PG-TEST-0001', { revoked_at_utc: '2026-04-24T01:00:00Z', reason: 'test' });
  const revoked = await verifyRecord('QRV-PG-TEST-0001');
  assert.equal(revoked.verification.status, 'REVOKED');
});

test('invalid format and not found map deterministically', async () => {
  const invalid = await verifyRecord('bad-id');
  assert.equal(invalid.verification.status, 'INVALID_FORMAT');

  const missing = await verifyRecord('QRV-MISSING-0001');
  assert.equal(missing.verification.status, 'NOT_FOUND');
});
