import Link from 'next/link';
import { dashboardCards } from '@/lib/onegodian-content';
import { getOmosSyncState } from '@/lib/omos-sync';
import { pluginRegistry } from '@/lib/plugin-registry';

export default function DashboardPage() {
  const sync = getOmosSyncState();

  const widgets = [
    { label: 'OMOS runtime status', value: String(sync.health?.status ?? 'unknown') },
    { label: 'Manifest version', value: String(sync.manifest?.version ?? 'unknown') },
    { label: 'Page registry count', value: String(sync.pages.length) },
    { label: 'Plugin targets', value: String(pluginRegistry.length) },
    { label: 'Last sync UTC', value: sync.lastSyncUtc ?? 'not-synced' },
    { label: 'Failing services', value: sync.errors.length ? sync.errors.join('; ') : 'none' }
  ];

  return <main className="space-y-8"><header className="rounded-2xl border border-cyan-400/30 bg-slate-950 p-6"><h1 className="text-3xl font-bold text-cyan-200">ONEGODIAN MEMBER DASHBOARD</h1></header><section className="grid gap-4 md:grid-cols-2">{dashboardCards.map((card) => <article key={card.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{card.title}</h2><span className="text-xs text-cyan-300">{card.status}</span></div><p className="mt-2 text-sm text-slate-300">{card.description}</p><Link href={card.href} className="mt-3 inline-block text-cyan-300">Open</Link></article>)}</section><section className="grid gap-4 md:grid-cols-3">{widgets.map((widget) => <article key={widget.label} className="rounded-xl border border-cyan-700/40 bg-slate-900/40 p-4"><h3 className="text-sm text-cyan-200">{widget.label}</h3><p className="mt-2 break-all text-lg font-semibold text-slate-100">{widget.value}</p></article>)}</section></main>;
}
