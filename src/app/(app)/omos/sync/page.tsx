import { syncOmos } from '@/lib/omos-sync';

export default async function OmosSyncPage() {
  const data = await syncOmos();
  return <main className="space-y-4"><h1 className="text-3xl font-bold">OMOS Sync</h1><p className="text-slate-300">Last sync UTC: {data.lastSyncUtc ?? 'never'}</p><pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-xs">{JSON.stringify(data, null, 2)}</pre></main>;
}
