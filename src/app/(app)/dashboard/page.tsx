import Link from 'next/link';
import { appDashboardCards, appHomeHero, coreRoutes } from '@/lib/app-content';

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <header className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Member Command Surface</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">ONEGODIAN MEMBER DASHBOARD</h1>
        <p className="mt-4 max-w-5xl text-lg leading-7 text-slate-300">{appHomeHero.description}</p>
        <p className="mt-4 max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm leading-6 text-slate-200">
          {appHomeHero.positioning}
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appDashboardCards.map((card) => (
          <article key={card.href} className="mobile-card">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
              <span className="rounded-full border border-gold-300/40 bg-gold-300/10 px-2.5 py-1 text-xs font-bold text-gold-100">{card.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
            <Link href={card.href} className="mt-5 inline-block text-xs font-black uppercase tracking-[0.22em] text-gold-300">
              {card.buttonLabel} →
            </Link>
          </article>
        ))}
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
