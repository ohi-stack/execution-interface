import Link from 'next/link';
import { appMeta } from '@/lib/onegodian-content';

const routes = [
  { href: '/ecosystem', label: 'Ecosystem', detail: 'Connected domain and platform map' },
  { href: '/omos', label: 'OMOS', detail: 'Operating model and runtime context' },
  { href: '/remember', label: 'Remember', detail: 'Campaign access and participation' },
  { href: '/membership', label: 'Membership', detail: 'Member pathways and records entry' },
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
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold-300">{appMeta.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{appMeta.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{appMeta.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={appMeta.primaryCta.href} className="premium-button">{appMeta.primaryCta.label}</Link>
            <Link href={appMeta.secondaryCta.href} className="premium-button-secondary">{appMeta.secondaryCta.label}</Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="mobile-card group">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-200/80">Node</span>
              <h2 className="mt-3 text-xl font-bold text-white group-hover:text-gold-200">{route.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{route.detail}</p>
              <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Open →</span>
import { appDashboardCards, appHomeHero } from '@/lib/app-content';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{appHomeHero.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">{appHomeHero.title}</h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{appHomeHero.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={appHomeHero.primaryCta.href} className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200">
              {appHomeHero.primaryCta.label}
            </Link>
            <Link href={appHomeHero.secondaryCta.href} className="rounded-xl border border-cyan-400/60 px-5 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-500/10">
              {appHomeHero.secondaryCta.label}
            </Link>
          </div>
        </section>

        <section aria-labelledby="dashboard-cards" className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Production modules</p>
            <h2 id="dashboard-cards" className="mt-1 text-2xl font-bold">Unified OneGodian App dashboard</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {appDashboardCards.map((card) => (
              <Link key={card.href} href={card.href} className="group rounded-2xl border border-slate-700 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-200">{card.title}</h3>
                  <span className="rounded-full border border-cyan-400/40 px-2 py-1 text-xs text-cyan-200">{card.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-cyan-300">Open {card.href}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <h2 className="text-xl font-bold text-emerald-100">OneGodian.com</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/80">Commerce and identity product engine for ONEGODIAN, LLC products, memberships, checkout, fulfillment, and product-linked identity flows.</p>
          </article>
          <article className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6">
            <h2 className="text-xl font-bold text-violet-100">OneGodian.org</h2>
            <p className="mt-2 text-sm leading-6 text-violet-50/80">Civil, cultural, educational, and human-facing interpretation platform for public context, remembrance, and non-commerce orientation.</p>
          </article>
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
