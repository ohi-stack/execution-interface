import Link from 'next/link';
import { syncOmos } from '@/lib/omos-sync';
import { propertyRegistry } from '@/lib/property-registry';
import { pluginRegistry } from '@/lib/plugin-registry';

export default async function OmosPage() {
  const sync = await syncOmos();
  const failingServices = sync.errors;
  const health = {
    runtime: (sync.health?.status as string | undefined) ?? 'unknown',
    manifestVersion: (sync.manifest?.version as string | undefined) ?? 'unknown',
    pageRegistryCount: sync.pages.length,
    lastSyncUtc: sync.lastSyncUtc,
    failingServices
  };

  const cards = [
    ['OMOS runtime status', health.runtime],
    ['Last sync UTC', health.lastSyncUtc ?? 'never'],
    ['Manifest version', health.manifestVersion],
    ['Canonical domain', 'https://omos.onegodian.com'],
    ['Page registry count', String(health.pageRegistryCount)],
    ['Property count', String(propertyRegistry.length)],
    ['Plugin count', String(pluginRegistry.length)],
    ['Failing services', String(health.failingServices.length)]
  ];

  return <main className="space-y-6"><header><h1 className="text-3xl font-bold">OMOS Dashboard</h1><p className="text-slate-300">Public OMOS runtime and registry status from app APIs.</p></header><section className="grid gap-3 md:grid-cols-2">{cards.map(([k, v]) => <article key={k} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h2 className="text-sm uppercase text-slate-400">{k}</h2><p className="text-lg font-semibold text-cyan-200">{v}</p></article>)}</section><section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h2 className="text-xl font-semibold">OMOS Pages</h2><div className="mt-2 flex flex-wrap gap-4">{['manifest', 'pages', 'health', 'sync', 'plugins', 'properties'].map((segment) => <Link key={segment} href={`/omos/${segment}`} className="text-cyan-300 hover:underline">/omos/{segment}</Link>)}</div></section></main>;
}
