import { getOmosSyncState } from '@/lib/omos-sync';
import { propertyRegistry } from '@/lib/property-registry';
import { pluginRegistry } from '@/lib/plugin-registry';

export default function SystemHealthPage() {
  const sync = getOmosSyncState();
  const status = sync.errors.length > 0 ? 'degraded' : 'healthy';

  const cards: [string, string][] = [
    ['App health', status],
    ['OMOS sync state', sync.health?.status ? String(sync.health.status) : 'unknown'],
    ['Property count', String(propertyRegistry.length)],
    ['Plugin count', String(pluginRegistry.length)],
    ['Last sync UTC', sync.lastSyncUtc ?? 'not-synced'],
    ['Failing services', sync.errors.length ? sync.errors.join(', ') : 'none'],
    ['Production warnings', sync.errors.length ? 'OMOS sync is degraded' : 'none']
  ];

  return <main className="space-y-5"><h1 className="text-3xl font-bold">System Health</h1><div className="grid gap-4 md:grid-cols-2">{cards.map(([k,v])=><article key={k} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><p className="text-sm text-cyan-300">{k}</p><p className="mt-2 break-all text-slate-100">{v}</p></article>)}</div></main>;
}
