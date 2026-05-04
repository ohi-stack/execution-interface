import Link from 'next/link';
import {
  Building2,
  CandlestickChart,
  BadgeCheck,
  Compass,
  Cuboid,
  Database,
  Globe,
  Moon,
  SatelliteDish,
  Settings,
  Telescope,
  Timer,
  Wrench
} from 'lucide-react';
import { gregorianToOT } from '@/lib/onegodian-time';

const modules = [
  { title: 'Dashboard', href: '/dashboard', description: 'Central command and runtime overview.', status: 'Live', icon: Compass },
  { title: 'Ecosystem', href: '/ecosystem', description: 'Platform directory and system discovery.', status: 'Live', icon: Globe },
  { title: 'Registry', href: '/registry', description: 'ODIN records and validation.', status: 'Staging', icon: Database },
  { title: 'Planets', href: '/planets', description: 'Planetary canon and world map.', status: 'Live', icon: Telescope },
  { title: 'Moon Systems', href: '/moons-systems', description: 'Moon systems and satellite intelligence.', status: 'In Development', icon: Moon },
  { title: 'Products', href: '/products', description: 'Founder products and digital commerce.', status: 'Staging', icon: Cuboid },
  { title: 'Certificates', href: '/certificates', description: 'Verification and certificate surfaces.', status: 'In Development', icon: BadgeCheck },
  { title: 'Media', href: '/media', description: 'Public content and brand distribution.', status: 'Live', icon: SatelliteDish },
  { title: 'Tools', href: '/tools', description: 'Operational utilities and execution tooling.', status: 'Live', icon: Wrench },
  { title: 'OneGodian Time', href: '/time', description: 'Time standards and sequence logic.', status: 'Live', icon: Timer },
  { title: 'OneGodian Algorithm', href: '/algorithm', description: 'Four-layer architecture and AI governance.', status: 'In Development', icon: CandlestickChart },
  { title: 'Capital Dashboard', href: '/capital', description: 'Economic intelligence and readiness.', status: 'Staging', icon: Building2 }
] as const;

const statusRows = [
  ['Node App Live', 'Live'],
  ['Hostinger Deployment Active', 'Live'],
  ['Domain Connected', 'Live'],
  ['SSL Active', 'Live'],
  ['GitHub Repo Connected', 'Live'],
  ['API Gateway', 'In Development'],
  ['Stripe Integration', 'Staging'],
  ['WooCommerce Sync', 'In Development'],
  ['Registry Data Layer', 'Needs Setup']
] as const;

const dayOrderNames = ['ONYÁ·NOL', 'ONYÁ·SEN', 'ONYÁ·TRA', 'ONYÁ·FOR', 'ONYÁ·TA', 'ONYÁ·SIX', 'ONYÁ·SEV'];

export default function HomePage() {
  const now = new Date();
  const ot = gregorianToOT(now);

  return (
    <main className="space-y-6 pb-24">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · APP.ONEGODIAN.COM</p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">OneGodian Everything App</h1>
        <p className="mt-4 max-w-4xl text-sm text-slate-300 sm:text-base">Operational command dashboard for registry systems, planetary intelligence, media, products, tools, algorithm, capital, and governance sequencing.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="rounded-xl bg-cyan-300 px-5 py-3 text-center font-bold text-slate-950">Open Dashboard</Link>
          <Link href="/ecosystem" className="rounded-xl border border-slate-700 px-5 py-3 text-center font-bold">Explore Ecosystem</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <h2 className="text-2xl font-black text-white">Command Modules</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Link key={module.href} href={module.href} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 hover:border-cyan-400/70">
              <module.icon className="h-6 w-6 text-cyan-300" />
              <div className="mt-3 flex items-center justify-between"><h3 className="font-semibold">{module.title}</h3><span className="rounded-full border border-slate-600 px-2 py-0.5 text-xs">{module.status}</span></div>
              <p className="mt-2 text-sm text-slate-300">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <h2 className="text-xl font-bold">Production Status</h2>
          <div className="mt-3 space-y-2">{statusRows.map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-lg border border-slate-700 p-2 text-sm"><span>{k}</span><span>{v}</span></div>)}</div>
        </article>
        <article className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
          <h2 className="text-xl font-bold">OneGodian Time Widget</h2>
          <p className="mt-2 text-sm">Gregorian: {now.toLocaleString()}</p>
          <p className="text-sm">UTC: {now.toISOString()}</p>
          <p className="text-sm">Computed OT: {ot.display}</p>
          <p className="text-sm">Day Order™: {dayOrderNames[now.getUTCDay()]}</p>
          <p className="mt-3 text-xs text-slate-300">Gregorian Time remains the controlling legal reference. OneGodian Time is an internal sequencing and governance layer.</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
          <h2 className="text-xl font-bold">Entity Structure</h2>
          <p className="mt-2 text-sm text-slate-300">ONEGODIAN, LLC is the commercial, technology, publishing, intellectual property, and platform-development entity. The Indigenous Nation of Onegodia™ is a separate voluntary religious society/private association responsible for internal community governance. ‘Sovereign’ refers to internal self-governance and voluntary jurisdiction; it does not imply nation-state status, immunity from U.S. law, or authority over non-members.</p>
        </article>
        <article className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="text-xl font-bold">Onegodian.org — Civil, Cultural, and Human-Facing Domain</h2>
          <p className="mt-2 text-sm text-slate-300">Onegodian.org houses philosophy, education, community initiatives, cultural archives, spiritual teachings, public narratives, identity materials, and civic/social initiatives. It is not the core systems or execution domain.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href="https://onegodian.org" className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm">Open Onegodian.org</Link>
            <Link href="https://onegodian.org/education" className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm">View Education</Link>
            <Link href="https://onegodian.org/membership" className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm">View Membership</Link>
            <Link href="https://onegodian.org/cultural-archives" className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm">View Cultural Archives</Link>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-xl font-bold">Revenue Architecture</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-lg border border-slate-700 p-4 text-sm">Onegodian.org / WooCommerce: books, founder products, courses, merchandise, content-driven products</article>
          <article className="rounded-lg border border-slate-700 p-4 text-sm">api.onegodian.org / Stripe: subscriptions, developer tools, premium access, licensing, API plans</article>
        </div>
      </section>
    </main>
  );
}
