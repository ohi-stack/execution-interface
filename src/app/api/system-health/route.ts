import { NextResponse } from 'next/server';
import { getOmosSyncState } from '@/lib/omos-sync';

export async function GET() {
  const sync = getOmosSyncState();
  const failingServices = sync.errors;

  return NextResponse.json({
    runtime: sync.health?.status ?? 'unknown',
    manifestVersion: sync.manifest?.version ?? 'unknown',
    pageRegistryCount: sync.pages.length,
    lastSyncUtc: sync.lastSyncUtc,
    failingServices,
    status: failingServices.length > 0 ? 'degraded' : 'healthy'
  });
}
