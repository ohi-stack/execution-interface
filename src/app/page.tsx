import Link from 'next/link';
import { appModules } from '@/lib/app-modules';

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN COMMAND HUB</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Unified Operational Interface</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">May 2026 systems model for identity, systems, registries, infrastructure, execution, capital, media, and developer access.</p>
      </section>
      <section className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
        <h2 className="text-xl font-semibold">May 2026 Systems Model</h2>
        <p className="mt-2 text-sm text-slate-300">View the full hierarchy and infrastructure-control thesis.</p>
        <Link href="/systems" className="mt-3 inline-flex rounded-lg border border-cyan-400/60 px-4 py-2 text-sm text-cyan-200">Open Systems Model</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appModules.map((module) => (
          <article key={module.slug} className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">{module.title}</h2><span className="rounded-full border border-cyan-500/30 px-2 py-1 text-xs text-cyan-200">{module.productionStatus}</span></div>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{module.category}</p>
            <p className="mt-3 text-sm text-slate-300">{module.description}</p>
            <Link href={module.route} className="mt-4 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200">Open Module</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
