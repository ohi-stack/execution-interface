import Link from 'next/link';

type StatusWidget = {
  label: string;
  value: string;
  accent: 'cyan' | 'gold';
};

type ModuleCard = {
  title: string;
  href: string;
  description: string;
  stats: string[];
  glyph: string;
};

const statusWidgets: StatusWidget[] = [
  { label: 'App Status', value: 'Online', accent: 'cyan' },
  { label: 'ODIN Registry', value: 'Active', accent: 'gold' },
  { label: 'OneGodian Time™', value: 'OTS-V5 Active', accent: 'cyan' },
  { label: 'Ecosystem', value: 'Route Active', accent: 'gold' },
  { label: 'Mobile Navigation', value: 'Enabled', accent: 'cyan' },
];

const moduleGroups: { title: string; modules: ModuleCard[] }[] = [
  {
    title: 'Core Registry',
    modules: [
      {
        title: 'Planetary Registry',
        href: '/planets',
        description: 'ODIN-PR planets, civilizations, and registry systems.',
        stats: ['25 Planets', 'ODIN-PR', 'Canon'],
        glyph: '◉',
      },
      {
        title: 'ODIN Registry',
        href: '/odin',
        description: 'Canonical registry hub for series, platforms, verification, worlds, and planetary records.',
        stats: ['Registry', 'Verification', 'Canon'],
        glyph: '⌬',
      },
      {
        title: 'OneGodian Time™',
        href: '/time',
        description: 'OTS-V5 dual-date clock, Gregorian → OneGodian converter, epoch rules, and timestamp governance.',
        stats: ['OTS-V5', 'UTC Truth', '13 Months'],
        glyph: '⏣',
      },
      {
        title: 'Certificates',
        href: '/certificates',
        description: 'Certificate views, registry references, and OneGodian verification records.',
        stats: ['Records', 'Identity', 'Archive'],
        glyph: '▣',
      },
    ],
  },
  {
    title: 'Worlds & Systems',
    modules: [
      {
        title: 'Moons & Systems',
        href: '/moons-systems',
        description: 'Moon systems, orbital continuity, and expansion interfaces.',
        stats: ['Moons', 'Orbits', 'Systems'],
        glyph: '◍',
      },
      {
        title: 'Ecosystem',
        href: '/ecosystem',
        description: 'Connected OneGodian systems and infrastructure layers.',
        stats: ['Routes', 'Modules', 'Infrastructure'],
        glyph: '◈',
      },
      {
        title: 'Media Center',
        href: '/media',
        description: 'Visual media, banners, assets, and content presentation layers.',
        stats: ['Media', 'Assets', 'Visuals'],
        glyph: '◫',
      },
      {
        title: 'Products',
        href: '/products',
        description: 'Product surfaces, digital assets, app-linked offerings, and commerce expansion.',
        stats: ['Store', 'Digital', 'Commerce'],
        glyph: '◬',
      },
    ],
  },
  {
    title: 'Tools & Operations',
    modules: [
      {
        title: 'Tools',
        href: '/tools',
        description: 'Operational utilities, converters, dashboards, and app functions.',
        stats: ['Utilities', 'Engines', 'Workflow'],
        glyph: '⚙',
      },
      {
        title: 'Registry',
        href: '/registry',
        description: 'Unified registry access for app-level records and canonical systems.',
        stats: ['Index', 'Records', 'Links'],
        glyph: '▦',
      },
      {
        title: 'Dashboard',
        href: '/dashboard',
        description: 'Operational dashboard for the OneGodian App interface.',
        stats: ['Modules', 'Status', 'Navigation'],
        glyph: '◩',
      },
      {
        title: 'Profile',
        href: '/profile',
        description: 'Identity profile, app presence, and user-facing account layer.',
        stats: ['Identity', 'Account', 'Access'],
        glyph: '◪',
      },
    ],
  },
];

const wireframeFlow = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Registry', href: '/registry' },
  { label: 'Planetary Systems', href: '/planets' },
  { label: 'Time', href: '/time' },
  { label: 'Tools', href: '/tools' },
  { label: 'Profile', href: '/profile' },
];

const milestones = [
  {
    title: 'Ecosystem Route Added',
    text: 'Production-safe ecosystem module and route added to the app.',
  },
  {
    title: 'ODIN Registry Expanded',
    text: 'ODIN landing pages, registry datasets, navigation, and reusable components added.',
  },
  {
    title: 'Navigation Upgraded',
    text: 'Glyph cards, accents, mobile navigation, and stronger dashboard identity added.',
  },
  {
    title: 'OneGodian Time™ Added',
    text: 'OTS-V5 deterministic conversion library and dashboard widgets merged.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN PLATFORM</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">OneGodian Everything App</h1>
          <p className="mt-3 text-lg text-cyan-100">Central command interface for the OneGodian ecosystem.</p>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Access registry systems, planetary worlds, moon systems, OneGodian Time™, ODIN records, ecosystem infrastructure, media, tools, products, certificates, and profile services from one synchronized app interface.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:text-base">Open Dashboard</Link>
            <Link href="/registry" className="rounded-xl border border-cyan-400/60 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 sm:text-base">Explore Registry</Link>
            <Link href="/time" className="rounded-xl border border-amber-300/60 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-amber-200 transition hover:border-amber-200 sm:text-base">OneGodian Time™</Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {statusWidgets.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
              <p className={`mt-2 text-base font-semibold ${item.accent === 'cyan' ? 'text-cyan-200' : 'text-amber-200'}`}>{item.value}</p>
            </article>
          ))}
        </section>

        {moduleGroups.map((group) => (
          <section key={group.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">{group.title}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {group.modules.map((module) => (
                <Link key={module.title} href={module.href} className="group rounded-xl border border-slate-700 bg-slate-950/70 p-5 transition hover:border-cyan-400/60 hover:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-cyan-300">{module.glyph}</span>
                    <span className="text-xs uppercase tracking-[0.15em] text-slate-400 group-hover:text-cyan-200">Open</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-50">{module.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{module.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.stats.map((stat) => (
                      <span key={stat} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200">{stat}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold sm:text-2xl">App Wireframe</h2>
          <p className="mt-3 max-w-4xl text-slate-300">
            The OneGodian App organizes registry, planetary, timekeeping, media, product, and identity systems into one synchronized interface.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
            {wireframeFlow.map((item, index) => (
              <div key={item.label} className="flex items-center gap-2">
                <Link href={item.href} className="rounded-full border border-cyan-500/50 bg-slate-950/70 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300">{item.label}</Link>
                {index < wireframeFlow.length - 1 && <span className="text-slate-500">→</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold sm:text-2xl">Recent App Milestones</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {milestones.map((milestone) => (
              <article key={milestone.title} className="rounded-xl border border-slate-700 bg-slate-950/70 p-5">
                <h3 className="text-base font-semibold text-slate-100">{milestone.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{milestone.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
