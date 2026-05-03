import Link from 'next/link';
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Database,
  Globe,
  LayoutDashboard,
  Newspaper,
  Orbit,
  ShoppingBag,
  Sparkles,
  Wrench
} from 'lucide-react';
import { TodayInOneGodianTime } from '@/components/today-in-onegodian-time';

const mainNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Ecosystem', href: '/ecosystem', icon: Globe },
  { label: 'Registry', href: '/registry', icon: Database },
  { label: 'Planets', href: '/planets', icon: Orbit },
  { label: 'Time', href: '/time', icon: Clock3 },
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Certificates', href: '/certificates', icon: BadgeCheck },
  { label: 'Media', href: '/media', icon: Newspaper },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'Capital', href: '/dashboard', icon: BriefcaseBusiness },
  { label: 'Agents', href: '/algorithm', icon: Sparkles }
];

const stackItems = [
  'Identity, Verification & Digital Trust',
  'Capital, Commerce & Economic Engines',
  'Governance Intelligence & Decision Systems',
  'Land, Housing & Real Infrastructure',
  'Human + AI + Robotics Alignment',
  'Global Trade & Opportunity Networks',
  'Cloud, Cybersecurity & Runtime Systems',
  'Education, Media & Narrative Power',
  'Community Networks & Membership Systems',
  'Time, Archives & Historical Continuity',
  'Research, Science & Future Labs',
  'Creative Worlds & Entertainment Ecosystem',
  'Personal Mastery & Human Development',
  'Meta Coordination Layer'
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP</p>
          <h1 className="mt-3 text-3xl font-bold">OneGodian Everything App</h1>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-sm text-slate-100 hover:border-cyan-400/40 hover:text-cyan-200">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold text-cyan-200">Production Status</h2>
            <p className="mt-2 text-sm text-slate-300">Node App Live · Hostinger Deployment Active · Ecosystem Directory Online.</p>
          </article>
          <TodayInOneGodianTime />
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">OneGodian Civilization Stack</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stackItems.map((item, idx) => (
              <article key={item} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs text-cyan-300">Layer {idx + 1}</p>
                <h3 className="mt-1 text-sm font-medium text-slate-100">{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"><h2 className="text-lg font-semibold">Ecosystem Command Cards</h2></article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"><h2 className="text-lg font-semibold">Registry / ODIN / QR-V</h2></article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"><h2 className="text-lg font-semibold">Products + Revenue Engines</h2></article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">Capital Dashboard</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>Estimated Current Strategic Platform Value: <span className="text-cyan-200">$52M</span></li>
              <li>3-Year Strategic Target Range: <span className="text-cyan-200">$135M–$205M</span></li>
              <li>Execution Readiness Index: <span className="text-cyan-200">71.4%</span></li>
              <li>Compliance & Verification Readiness: <span className="text-cyan-200">82.6%</span></li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">Non-Audited Internal Strategic Estimate</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"><h2 className="text-lg font-semibold">Media + Galaxy</h2></article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">OneGodian Algorithm</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {['Protocol Layer', 'Experience Layer', 'Community Layer', 'Orientation Layer'].map((name) => (
                <div key={name} className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">{name}</div>
              ))}
            </div>
            <Link href="/algorithm" className="mt-4 inline-flex rounded-lg border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">Open Algorithm</Link>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">Belief Mapper Lite (Planned)</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {['Seeker', 'Believer', 'OneGodian', 'Elder'].map((stage) => (
                <div key={stage} className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">{stage}</div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">Legal Clarity</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">OneGodian App is a private digital platform operated for identity, education, commerce, documentation, registry, and system-management purposes. References to sovereign or sovereignty describe internal self-governance, voluntary participation, ownership, dignity, and private organizational frameworks. They do not assert governmental authority over non-members, immunity from U.S. law, or diplomatic recognition.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
