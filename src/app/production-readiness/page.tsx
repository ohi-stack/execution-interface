import { CapitalReadinessTable } from '../components/CapitalReadinessTable';
import { readinessItems } from '../data';

export default function ProductionReadinessPage() {
  return <main className="mx-auto max-w-6xl px-4 py-10 text-slate-100"><h1 className="text-3xl font-bold">Production Readiness</h1><p className="mt-2 text-slate-300">Current operating maturity for the capital.onegodian.com Hostinger Node application.</p><section className="mt-6"><CapitalReadinessTable items={readinessItems} /></section><section className="mt-8"><h2 className="text-xl font-semibold">Next Actions</h2><div className="mt-3 grid gap-3 md:grid-cols-2">{readinessItems.map((item) => <article key={item.layer} className="rounded-lg border border-slate-700 bg-slate-900/70 p-4"><h3 className="font-medium">{item.layer}</h3><p className="text-sm text-cyan-200">Status: {item.status}</p><p className="text-sm text-slate-300">{item.detail}</p></article>)}</div></section></main>;
}
