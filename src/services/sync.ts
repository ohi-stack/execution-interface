import { syncResources } from '@/lib/platform';

export async function getSyncStatus() {
  return {
    mode: 'production-ready-scaffold',
    fullSync: 'available',
    incrementalSync: 'available',
    webhookSync: 'available',
    nightlyReconciliation: 'scheduled',
    manualSync: 'available',
    queues: { retry: 'configured', deadLetter: 'configured', pending: 0, failed: 0 },
    resources: syncResources,
    lastSynced: null,
  };
}

export async function enqueueManualSync() {
  return { jobId: `manual-${Date.now()}`, status: 'queued' };
}
