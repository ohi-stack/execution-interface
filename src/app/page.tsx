import Link from 'next/link';
import { appModules, type Priority, type ProductionStatus } from '@/lib/app-modules';

const statusStyles: Record<ProductionStatus, string> = {
  Live: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  'Demo Ready': 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  Staging: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  'In Development': 'border-violet-500/40 bg-violet-500/15 text-violet-300',
  'Needs Setup': 'border-orange-500/40 bg-orange-500/15 text-orange-300',
  Planned: 'border-slate-500/40 bg-slate-500/15 text-slate-300',
  Offline: 'border-red-500/40 bg-red-500/15 text-red-300'
};

const priorityStyles: Record<Priority, string> = {
  Critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  High: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  Medium: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  Low: 'border-slate-500/40 bg-slate-500/10 text-slate-300'
};

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · APP.ONEGODIAN.COM</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian App Systems Model</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Central interface layer for navigation, discovery, dashboards, tools, games, records, products, certificates, and future execution environments.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appModules.map((module) => (
          <article key={module.slug} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{module.category}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{module.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{module.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
              <span className={`rounded-full border px-2 py-1 ${statusStyles[module.productionStatus]}`}>{module.productionStatus}</span>
              <span className={`rounded-full border px-2 py-1 ${priorityStyles[module.priority]}`}>{module.priority} Priority</span>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              {module.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link href={module.route} className="mt-5 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10">
              Open Module
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
