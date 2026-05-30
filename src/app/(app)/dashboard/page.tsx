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

  return (
    <main className="space-y-8">
      <header className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Member Command Surface</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">ONEGODIAN MEMBER DASHBOARD</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {dashboardCards.map((card) => (
          <article key={card.title} className="mobile-card">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
              <span className="rounded-full border border-gold-300/40 bg-gold-300/10 px-2.5 py-1 text-xs font-bold text-gold-100">{card.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
            <Link href={card.href} className="mt-5 inline-block text-xs font-black uppercase tracking-[0.22em] text-gold-300">Open →</Link>
          </article>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {widgets.map((widget) => (
          <article key={widget.label} className="rounded-3xl border border-purple-300/15 bg-white/[0.045] p-4 shadow-sovereign backdrop-blur-xl">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-100/80">{widget.label}</h3>
            <p className="mt-3 break-all text-lg font-bold text-white">{widget.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
