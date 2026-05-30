import { CapitalReadinessTable } from '../components/CapitalReadinessTable';
import { readinessItems } from '../data';

export default function ProductionReadinessPage() {
  return (
    <main className="onegodian-surface mx-auto max-w-6xl px-4 py-10 text-slate-100">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Production Operations</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">Production Readiness</h1>
        <p className="mt-3 leading-7 text-slate-300">Current operating maturity for the OneGodian Hostinger Node application.</p>
      </section>
      <section className="mt-6"><CapitalReadinessTable items={readinessItems} /></section>
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Next Actions</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {readinessItems.map((item) => (
            <article key={item.layer} className="mobile-card">
              <h3 className="font-bold text-white">{item.layer}</h3>
              <p className="mt-2 text-sm font-semibold text-gold-300">Status: {item.status}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
