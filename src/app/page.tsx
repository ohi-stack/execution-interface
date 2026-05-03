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
type SystemStatus = {
  title: string;
  status: 'Live' | 'In Development' | 'Needs Setup' | 'Planned';
};

type QuickLinkCard = {
  title: string;
  href: string;
  description: string;
  external?: boolean;
};

const systemStatuses: SystemStatus[] = [
  { title: 'Node App Live', status: 'Live' },
  { title: 'Hostinger Deployment Active', status: 'Live' },
  { title: 'Ecosystem Directory', status: 'Live' },
  { title: 'Time Converter', status: 'In Development' },
  { title: 'Docs Library', status: 'Needs Setup' },
  { title: 'API Gateway', status: 'Needs Setup' },
  { title: 'GitHub Repo Matrix', status: 'In Development' },
  { title: 'Alignment Demo', status: 'Planned' },
];

const commandCenterModules: QuickLinkCard[] = [
  { title: 'ODIN Registry', href: '/odin', description: 'Open ODIN command pages and governance modules.' },
  { title: 'Planetary Registry', href: '/odin/planetary-registry', description: 'Browse PR worlds and linked platform endpoints.' },
  { title: 'Moons & Systems', href: '/moons-systems', description: 'Review moon, systems, and orbital mapping tools.' },
  { title: 'Learn Portal', href: '/learn', description: 'Access learning pathways and onboarding content.' },
  { title: 'Identity Wallet', href: '/identity', description: 'Manage identity records and wallet references.' },
  { title: 'Verification Tools', href: '/verification', description: 'Validate records, trust states, and verification workflows.' },
  { title: 'Capital Access', href: '/capital', description: 'Explore financing pathways and capital-facing modules.' },
  { title: 'Media Center', href: '/media', description: 'Find media publications and communication assets.' },
  { title: 'Storefront', href: '/store', description: 'Open commerce modules and storefront operations.' },
  { title: 'OneGodian Time', href: '/time', description: 'Launch OTS-V5 time conversion and timing references.' },
];

const externalPlatformBridges: QuickLinkCard[] = [
  { title: 'Student Portal', href: 'https://u.onegodian.org/dashboard', description: 'Open the external student dashboard.', external: true },
  { title: 'Courses', href: 'https://u.onegodian.org/courses', description: 'View active and archived learning courses.', external: true },
  { title: 'Onegodianese™ Curriculum', href: 'https://u.onegodian.org/curriculum', description: 'Open curriculum paths and lesson maps.', external: true },
  { title: 'Developer/API Access', href: '/developer', description: 'Enter developer tooling and API access modules.' },
];

const statusStyles: Record<SystemStatus['status'], string> = {
  Live: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
  'In Development': 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200',
  'Needs Setup': 'border-amber-400/50 bg-amber-500/10 text-amber-200',
  Planned: 'border-violet-400/50 bg-violet-500/10 text-violet-200',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN COMMAND DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">OneGodian System Control Surface</h1>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold sm:text-2xl">Production Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {systemStatuses.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-200">{item.title}</p>
                <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">Command Center Modules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {commandCenterModules.map((module) => (
              <Link key={module.title} href={module.href} className="group rounded-xl border border-slate-700 bg-slate-950/70 p-5 transition hover:border-cyan-400/60 hover:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-50">{module.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">External Platform Bridges</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {externalPlatformBridges.map((bridge) => (
              <Link
                key={bridge.title}
                href={bridge.href}
                target={bridge.external ? '_blank' : undefined}
                rel={bridge.external ? 'noreferrer noopener' : undefined}
                className="group rounded-xl border border-slate-700 bg-slate-950/70 p-5 transition hover:border-cyan-400/60 hover:bg-slate-900"
              >
                <h3 className="text-lg font-semibold text-slate-50">{bridge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{bridge.description}</p>
              </Link>
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
