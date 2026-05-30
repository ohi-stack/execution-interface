import Link from 'next/link';
import { appDashboardCards, appHomeHero } from '@/lib/app-content';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{appHomeHero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{appHomeHero.title}</h1>
          <p className="mt-4 max-w-4xl text-lg text-slate-300">{appHomeHero.description}</p>
          <p className="mt-4 max-w-4xl rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">
            {appHomeHero.positioning}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={appHomeHero.primaryCta.href} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              {appHomeHero.primaryCta.label}
            </Link>
            <Link href={appHomeHero.secondaryCta.href} className="rounded-full border border-cyan-300/70 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/10">
              {appHomeHero.secondaryCta.label}
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Core Modules</p>
            <h2 className="mt-2 text-2xl font-semibold">Central Access Dashboard</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appDashboardCards.map((module) => (
              <article key={module.href} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-100">{module.title}</h3>
                  <span className="rounded-full border border-cyan-400/50 px-2 py-1 text-xs text-cyan-200">{module.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{module.description}</p>
                <Link href={module.href} className="mt-5 inline-flex rounded-full border border-cyan-400/70 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10">
                  {module.buttonLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
