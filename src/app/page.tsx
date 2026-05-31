import Link from 'next/link';
import { appDashboardCards, appHomeHero } from '@/lib/app-content';

const routes = [
  { href: '/ecosystem', label: 'Ecosystem', detail: 'Connected domain and platform map' },
  { href: '/omos', label: 'OMOS', detail: 'Operating model and runtime context' },
  { href: '/remember', label: 'Remember', detail: 'Campaign access and participation' },
  { href: '/members', label: 'Members', detail: 'Member pathways and records entry' },
  { href: '/time', label: 'Time', detail: 'OneGodian Time and UTC clarity' },
  { href: '/commerce', label: 'Commerce', detail: 'Products, memberships, and checkout routing' },
  { href: '/institutional', label: 'Institutional', detail: 'Public boundary and clarity language' },
  { href: '/dashboard', label: 'Dashboard', detail: 'Member node overview and module status' }
];

export default function HomePage() {
  return (
    <main className="onegodian-surface min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="glass-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full border border-gold-300/30 bg-gold-300/10 blur-sm sm:block" />
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold-300">{appHomeHero.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{appHomeHero.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{appHomeHero.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={appHomeHero.primaryCta.href} className="premium-button">
              {appHomeHero.primaryCta.label}
            </Link>
            <Link href={appHomeHero.secondaryCta.href} className="premium-button-secondary">
              {appHomeHero.secondaryCta.label}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="mobile-card group">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-200/80">Node</span>
              <h2 className="mt-3 text-xl font-bold text-white group-hover:text-gold-200">{route.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{route.detail}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {appDashboardCards.slice(0, 4).map((card) => (
            <Link key={card.href} href={card.href} className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6 transition hover:border-cyan-300/60">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-cyan-100 group-hover:text-cyan-200">{card.title}</h3>
                <span className="rounded-full border border-cyan-400/40 px-2 py-1 text-xs text-cyan-200">{card.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-cyan-300">{card.buttonLabel}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
