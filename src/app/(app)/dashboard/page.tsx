import Link from 'next/link';
import { appDashboardCards, appHomeHero } from '@/lib/app-content';
import { coreRoutes } from '@/lib/onegodian-content';

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-3xl border border-cyan-400/30 bg-slate-950 p-6 shadow-[0_0_50px_rgba(34,211,238,0.08)]">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Central Access Dashboard</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-100">Welcome to the OneGodian App</h1>
        <p className="mt-4 max-w-5xl text-lg leading-7 text-slate-300">{appHomeHero.description}</p>
        <p className="mt-4 max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm leading-6 text-slate-200">
          {appHomeHero.positioning}
        </p>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Core Modules</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Use the OneGodian ecosystem</h2>
          </div>
          <Link href="/api/modules" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            View module API →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appDashboardCards.map((module) => (
            <article key={module.href} className="flex min-h-64 flex-col rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-100">{module.title}</h3>
                <span className="rounded-full border border-cyan-400/50 px-2 py-1 text-xs text-cyan-200">{module.status}</span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{module.description}</p>
              <Link href={module.href} className="mt-5 inline-flex w-fit rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                {module.buttonLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-cyan-200">Route availability</h2>
        <p className="mt-2 text-sm text-slate-300">These app routes are part of the immediate OneGodian access layer.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {coreRoutes.map((route) => (
            <code key={route} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200">
              {route}
            </code>
          ))}
        </div>
      </section>
    </main>
  );
}
