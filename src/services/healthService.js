import { env } from '../config/env.js';
import { query } from '../db/pool.js';

export const getServiceIndex = () => ({
  service: 'qrv-registry',
  role: 'canonical-datastore',
  subdomain: 'registry.qrv.network',
  registryBaseUrl: env.registryBaseUrl,
  endpoints: {
    health: '/health',
    getRegistryRecord: '/registry/:qrvid',
    createRegistryRecord: '/registry/create',
    createIssuer: '/registry/issuer/create',
    getIssuer: '/registry/issuers/:id',
    revokeRegistryRecord: '/registry/:qrvid/revoke',
    getRegistryAudit: '/registry/:qrvid/audit',
  },
});

export const getHealthStatus = async () => {
  const result = await query('SELECT NOW() AS database_time');
  return {
    status: 'ok',
    service: 'qrv-registry',
    role: 'canonical-datastore',
    subdomain: 'registry.qrv.network',
    database: 'ok',
    timestamp: new Date().toISOString(),
    databaseTime: result.rows[0].database_time instanceof Date
      ? result.rows[0].database_time.toISOString()
      : result.rows[0].database_time,
  };
};
