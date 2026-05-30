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
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
