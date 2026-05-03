import Link from 'next/link';
import { appModules, type Priority, type ProductionStatus } from '@/lib/app-modules';

type HealthCard = {
  title: string;
  url: string;
  status: 'Live' | 'In Development' | 'Needs Setup';
  target: string;
  lastChecked: string;
};

type QuickAction = {
  title: string;
  href: string;
  description: string;
  accent: 'cyan' | 'gold';
};

type DocumentCard = {
  title: string;
  description: string;
  href: string;
};

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

const healthCards: HealthCard[] = [
  {
    title: 'app.onegodian.com',
    url: 'https://app.onegodian.com',
    status: 'Live',
    target: 'Hostinger / Next.js App',
    lastChecked: 'Manual visual check active'
  },
  {
    title: 'api.onegodian.org',
    url: 'https://api.onegodian.org/health',
    status: 'In Development',
    target: 'Node API Service',
    lastChecked: 'Health endpoint integration pending'
  },
  {
    title: 'onegodian.org',
    url: 'https://onegodian.org',
    status: 'Live',
    target: 'WordPress / WooCommerce',
    lastChecked: 'Public site handoff active'
  },
  {
    title: 'u.onegodian.org',
    url: 'https://u.onegodian.org',
    status: 'Needs Setup',
    target: 'Education Execution Platform',
    lastChecked: 'Course platform routing pending'
  }
];

const quickActions: QuickAction[] = [
  { title: 'Open Dashboard', href: '/dashboard', description: 'View the operational command hub.', accent: 'cyan' },
  { title: 'Check API Health', href: 'https://api.onegodian.org/health', description: 'Open the API health endpoint.', accent: 'gold' },
  { title: 'Open OneGodian Time™', href: '/time', description: 'View time standard and date systems.', accent: 'cyan' },
  { title: 'View Products', href: '/products', description: 'Open digital products and store surfaces.', accent: 'gold' },
  { title: 'View Certificates', href: '/certificates', description: 'Open certificate and verification surfaces.', accent: 'cyan' },
  { title: 'Open Media Center', href: '/media', description: 'Open media, visuals, and brand assets.', accent: 'gold' },
  { title: 'Launch WooCommerce Store', href: 'https://onegodian.org/shop', description: 'Open the current commerce layer.', accent: 'cyan' },
  { title: 'Open Education System', href: 'https://onegodian.org/learn', description: 'Open the learning architecture hub.', accent: 'gold' }
];

const documentCards: DocumentCard[] = [
  {
    title: 'Whitepapers',
    description: 'OneGodian Algorithm™, protocol, governance, and institutional research documents.',
    href: '/media'
  },
  {
    title: 'WooCommerce Products',
    description: 'Product import files, digital downloads, books, courses, and store-ready assets.',
    href: '/products'
  },
  {
    title: 'Book Store',
    description: 'Gregory the Author, source files, product pages, and public book catalog.',
    href: '/products'
  },
  {
    title: 'Education System',
    description: 'Onegodianology, Onegodianosophy, Onegodianese, Onegodianism, and Onegodianonomics.',
    href: 'https://onegodian.org/learn'
  },
  {
    title: 'Scroll Covers',
    description: 'Visual meaning standards for covers, posters, scrolls, and symbolic product art.',
    href: '/media'
  },
  {
    title: 'Institutional Documents',
    description: 'Positioning statements, legal framing, founder records, and public-safe summaries.',
    href: '/registry'
  }
];

const completionTracker = [
  { module: 'Dashboard', status: 'Live', priority: 'Critical', nextAction: 'Add live health widgets', href: '/dashboard' },
  { module: 'Ecosystem', status: 'Live', priority: 'Critical', nextAction: 'Add filters and detail routes', href: '/ecosystem' },
  { module: 'Registry', status: 'In Development', priority: 'High', nextAction: 'Add record creation and API sync', href: '/registry' },
  { module: 'Time', status: 'Live', priority: 'High', nextAction: 'Add OTS display controls and daily stamp', href: '/time' },
  { module: 'Products', status: 'In Development', priority: 'High', nextAction: 'Connect WooCommerce/product imports', href: '/products' },
  { module: 'API', status: 'In Development', priority: 'Critical', nextAction: 'Connect real health and readiness checks', href: 'https://api.onegodian.org/health' },
  { module: 'Education', status: 'Needs Setup', priority: 'High', nextAction: 'Route learn pages to OneGodian U', href: 'https://onegodian.org/learn' },
  { module: 'Profile', status: 'Planned', priority: 'Medium', nextAction: 'Add auth and member account layer', href: '/profile' }
] as const;

function getCommandCount(status: ProductionStatus) {
  return appModules.filter((module) => module.productionStatus === status).length;
}

function getPriorityCount(priority: Priority) {
  return appModules.filter((module) => module.priority === priority).length;
}

export default function HomePage() {
  const liveCount = getCommandCount('Live') + getCommandCount('Demo Ready');
  const developmentCount = getCommandCount('In Development');
  const needsSetupCount = getCommandCount('Needs Setup') + getCommandCount('Planned');
  const criticalCount = getPriorityCount('Critical');

  return (
    <main className="space-y-6 pb-24">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · APP.ONEGODIAN.COM</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">OneGodian Everything App</h1>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
          The central Node/Next.js interface for the OneGodian ecosystem: ODIN registry systems, planetary canon, moon systems, products, certificates, media, tools, and synchronized platform infrastructure.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/dashboard" className="rounded-xl bg-cyan-300 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-200 sm:text-base">
            Open Dashboard
          </Link>
          <Link href="/ecosystem" className="rounded-xl border border-slate-700 bg-slate-950/60 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-cyan-300 sm:text-base">
            Explore Ecosystem
          </Link>
          <Link href="/time" className="rounded-xl border border-amber-300/60 bg-slate-950/60 px-5 py-3 text-center text-sm font-bold text-amber-200 transition hover:border-amber-200 sm:text-base">
            OneGodian Time™
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-950 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Today in OneGodian Time™</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">THE FIFTH DAY™ — ONYÁ·TA</h2>
          <p className="mt-2 text-lg font-semibold text-amber-200">The Expansion</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">OT Date</p>
              <p className="mt-1 font-semibold text-slate-100">Invention 4, 0000 (OT)</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Gregorian Sync</p>
              <p className="mt-1 font-semibold text-slate-100">Thu, Jan 15, 2026</p>
            </div>
          </div>
          <Link href="/time" className="mt-5 inline-flex rounded-xl border border-cyan-300/70 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-400/10">
            Open Time System
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Founder & Identity</p>
          <h2 className="mt-3 text-2xl font-black text-white">Gregory Lamar Jones / One Gregory OneGodian™</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Founder of ONEGODIAN, LLC, author of The OneGodian Algorithm™, and builder of the OneGodian App ecosystem.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Link href="/profile" className="rounded-lg border border-cyan-400/60 px-4 py-2 text-center text-sm font-semibold text-cyan-100 hover:bg-cyan-500/10">
              Founder Profile
            </Link>
            <Link href="/products" className="rounded-lg border border-amber-300/60 px-4 py-2 text-center text-sm font-semibold text-amber-100 hover:bg-amber-500/10">
              Author Page
            </Link>
            <Link href="/media" className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-100 hover:border-cyan-300">
              Whitepapers
            </Link>
            <Link href="/registry" className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-100 hover:border-cyan-300">
              Institutional Docs
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Live Systems</p>
          <p className="mt-3 text-4xl font-black text-white">{liveCount}</p>
          <p className="mt-2 text-sm text-slate-300">Operational or demo-ready modules.</p>
        </article>
        <article className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300">In Development</p>
          <p className="mt-3 text-4xl font-black text-white">{developmentCount}</p>
          <p className="mt-2 text-sm text-slate-300">Modules requiring backend/API completion.</p>
        </article>
        <article className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Needs Setup</p>
          <p className="mt-3 text-4xl font-black text-white">{needsSetupCount}</p>
          <p className="mt-2 text-sm text-slate-300">Planned or not-yet-connected modules.</p>
        </article>
        <article className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-red-300">Critical Priority</p>
          <p className="mt-3 text-4xl font-black text-white">{criticalCount}</p>
          <p className="mt-2 text-sm text-slate-300">Highest-priority app systems.</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Quick Actions</p>
            <h2 className="mt-2 text-2xl font-black text-white">Command Shortcuts</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-400">Fast links for registry, health, commerce, education, media, and production operations.</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                action.accent === 'cyan'
                  ? 'border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-300/70'
                  : 'border-amber-400/30 bg-amber-400/10 hover:border-amber-200/70'
              }`}
            >
              <h3 className="font-bold text-white">{action.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Production Health</p>
        <h2 className="mt-2 text-2xl font-black text-white">Connected System Status</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {healthCards.map((card) => (
            <a key={card.title} href={card.url} className="rounded-xl border border-slate-700 bg-slate-950/60 p-5 transition hover:border-cyan-400/60">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-white">{card.title}</h3>
                <span className={`rounded-full border px-2 py-1 text-xs ${statusStyles[card.status]}`}>{card.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{card.target}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">{card.lastChecked}</p>
            </a>
          ))}
        </div>
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

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Documents & Products</p>
        <h2 className="mt-2 text-2xl font-black text-white">Source Files, Store Assets, and Institutional Records</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documentCards.map((card) => (
            <Link key={card.title} href={card.href} className="rounded-xl border border-slate-700 bg-slate-950/60 p-5 transition hover:border-cyan-400/60">
              <h3 className="font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Completion Tracker</p>
        <h2 className="mt-2 text-2xl font-black text-white">App Modules Production Board</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
              <tr>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {completionTracker.map((item) => (
                <tr key={item.module}>
                  <td className="px-3 py-4 font-semibold text-white"><Link href={item.href}>{item.module}</Link></td>
                  <td className="px-3 py-4">{item.status}</td>
                  <td className="px-3 py-4">{item.priority}</td>
                  <td className="px-3 py-4 text-slate-300">{item.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
