import { getOmosSyncState } from '@/lib/omos-sync';
import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  const sync = getOmosSyncState();
  const failingServices = sync.errors;

  return jsonResponse(
    {
      runtime: sync.health?.status ?? 'unknown',
      manifestVersion: sync.manifest?.version ?? 'unknown',
      pageRegistryCount: sync.pages.length,
      lastSyncUtc: sync.lastSyncUtc,
      failingServices,
      status: failingServices.length > 0 ? 'degraded' : 'healthy'
    },
    request
  );
}
