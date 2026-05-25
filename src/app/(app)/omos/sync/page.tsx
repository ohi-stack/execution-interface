import { getOmosSyncState } from '@/lib/omos-sync';
export default function Page(){const s=getOmosSyncState(); return <main><h1 className="text-3xl font-bold">OMOS Sync</h1><p className="mt-3">Last sync UTC: {s.lastSyncUtc ?? 'not-synced'}</p></main>}
