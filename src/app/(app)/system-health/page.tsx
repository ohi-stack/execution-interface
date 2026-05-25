import { pluginRegistry } from '@/lib/plugin-registry';
import { propertyRegistry } from '@/lib/property-registry';
import { syncOmos } from '@/lib/omos-sync';

export default async function SystemHealthPage() {
  const sync = await syncOmos();
  const failing = sync.errors;

  return <main className="space-y-6"><h1 className="text-3xl font-bold">System Health</h1><section className="grid gap-3 md:grid-cols-2">{[
    ['App API health', failing.length ? 'degraded' : 'healthy'],
    ['OMOS sync state', failing.length ? 'degraded' : 'healthy'],
    ['Property registry count', String(propertyRegistry.length)],
    ['Plugin registry count', String(pluginRegistry.length)],
    ['Last sync UTC', sync.lastSyncUtc ?? 'never'],
    ['Failing services', String(failing.length)],
    ['Production warnings', failing.length ? failing.join('; ') : 'none']
  ].map(([k, v]) => <article key={k} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h2 className="text-sm uppercase text-slate-400">{k}</h2><p className="text-cyan-200">{v}</p></article>)}</section></main>;
}
