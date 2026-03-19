import test from 'node:test';
import assert from 'node:assert/strict';
import { getServiceIndex } from '../src/services/healthService.js';

test('getServiceIndex describes the registry service boundary and endpoints', () => {
  const index = getServiceIndex();

  assert.equal(index.service, 'qrv-registry');
  assert.equal(index.role, 'canonical-datastore');
  assert.equal(index.subdomain, 'registry.qrv.network');
  assert.equal(index.endpoints.health, '/health');
  assert.equal(index.endpoints.getRegistryRecord, '/registry/:qrvid');
});
