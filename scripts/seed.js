import { closePool } from '../src/db/pool.js';
import { createIssuer } from '../src/services/issuerService.js';
import { createRegistryRecord } from '../src/services/registryService.js';
import { logger } from '../src/config/logger.js';

try {
  const issuer = await createIssuer({
    issuerName: 'QR-V Demonstration Authority',
    issuerCode: 'QRV-DEMO',
    websiteUrl: 'https://registry.qrv.network',
    contactEmail: 'registry@qrv.network',
    actionActor: 'seed-script',
  });

  const record = await createRegistryRecord({
    recordType: 'certificate',
    issuerId: issuer.id,
    subjectName: 'Alex Example',
    assetName: 'Foundational Verification Certificate',
    description: 'Sample canonical registry record for local development.',
    actionActor: 'seed-script',
    certificate: {
      certificateNumber: 'QRV-DEMO-0001',
      issuedTo: 'Alex Example',
      issuedDate: '2026-03-19',
      expiryDate: '2027-03-19',
      metadata: {
        environment: 'local',
      },
    },
  });

  logger.info('Seeded QR-V registry sample data.', { issuerId: issuer.id, qrvid: record.qrvid });
} catch (error) {
  logger.error('Seed script failed.', { error: error.message });
  process.exitCode = 1;
} finally {
  await closePool();
}
