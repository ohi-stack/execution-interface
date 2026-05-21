import Link from 'next/link';

type StatusWidget = {
  label: string;
  value: string;
};

type ModuleCard = {
  title: string;
  href: string;
  description: string;
  stats: string[];
  glyph: string;
};

const statusWidgets: StatusWidget[] = [
  { label: 'App Status', value: 'Online' },
  { label: 'ODIN Registry', value: 'Active' },
  { label: 'OneGodian Time™', value: 'OTS-V5 Active' },
  { label: 'Ecosystem', value: 'Route Active' },
  { label: 'Mobile Navigation', value: 'Enabled' }
];

const moduleGroups: { title: string; cards: ModuleCard[] }[] = [
  {
    title: 'Core Registry',
    cards: [
      {
        title: 'Planetary Registry',
        href: '/planets',
        description: 'ODIN-PR planets, civilizations, and registry systems.',
        stats: ['25 Planets', 'ODIN-PR', 'Canon'],
        glyph: '🪐'
      },
      {
        title: 'ODIN Registry',
        href: '/odin',
        description: 'Canonical registry hub for series, platforms, verification, worlds, and planetary records.',
        stats: ['Registry', 'Verification', 'Canon'],
        glyph: '🧭'
      },
      {
        title: 'OneGodian Time™',
        href: '/time',
        description: 'OTS-V5 dual-date clock, Gregorian → OneGodian converter, epoch rules, and timestamp governance.',
        stats: ['OTS-V5', 'UTC Truth', '13 Months'],
        glyph: '⏱️'
      },
      {
        title: 'Certificates',
        href: '/certificates',
        description: 'Certificate views, registry references, and OneGodian verification records.',
        stats: ['Records', 'Identity', 'Archive'],
        glyph: '📜'
      }
    ]
  },
  {
    title: 'Worlds & Systems',
    cards: [
      {
        title: 'Moons & Systems',
        href: '/moons-systems',
        description: 'Moon systems, orbital continuity, and expansion interfaces.',
        stats: ['Moons', 'Orbits', 'Systems'],
        glyph: '🌙'
      },
      {
        title: 'Ecosystem',
        href: '/ecosystem',
        description: 'Connected OneGodian systems and infrastructure layers.',
        stats: ['Routes', 'Modules', 'Infrastructure'],
        glyph: '🌐'
      },
      {
        title: 'Media Center',
        href: '/media',
        description: 'Visual media, banners, assets, and content presentation layers.',
        stats: ['Media', 'Assets', 'Visuals'],
        glyph: '🎬'
      },
      {
        title: 'Products',
        href: '/products',
        description: 'Product surfaces, digital assets, app-linked offerings, and commerce expansion.',
        stats: ['Store', 'Digital', 'Commerce'],
        glyph: '🛍️'
      }
    ]
  },
  {
    title: 'Tools & Operations',
    cards: [
      {
        title: 'Tools',
        href: '/tools',
        description: 'Operational utilities, converters, dashboards, and app functions.',
        stats: ['Utilities', 'Engines', 'Workflow'],
        glyph: '🧰'
      },
      {
        title: 'Registry',
        href: '/registry',
        description: 'Unified registry access for app-level records and canonical systems.',
        stats: ['Index', 'Records', 'Links'],
        glyph: '📚'
      },
      {
        title: 'Dashboard',
        href: '/dashboard',
        description: 'Operational dashboard for the OneGodian App interface.',
        stats: ['Modules', 'Status', 'Navigation'],
        glyph: '📊'
      },
      {
        title: 'Profile',
        href: '/profile',
        description: 'Identity profile, app presence, and user-facing account layer.',
        stats: ['Identity', 'Account', 'Access'],
        glyph: '👤'
      }
    ]
  }
];

const appWireframe = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Registry', href: '/registry' },
  { label: 'Planetary Systems', href: '/planets' },
  { label: 'Time', href: '/time' },
  { label: 'Tools', href: '/tools' },
  { label: 'Profile', href: '/profile' }
];

const milestones = [
  {
    title: 'Ecosystem Route Added',
    text: 'Production-safe ecosystem module and route added to the app.'
  },
  {
    title: 'ODIN Registry Expanded',
    text: 'ODIN landing pages, registry datasets, navigation, and reusable components added.'
  },
  {
    title: 'Navigation Upgraded',
    text: 'Glyph cards, accents, mobile navigation, and stronger dashboard identity added.'
  },
  {
    title: 'OneGodian Time™ Added',
    text: 'OTS-V5 deterministic conversion library and dashboard widgets merged.'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">ONEGODIAN PLATFORM</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian Everything App</h1>
          <p className="mt-3 text-lg text-cyan-100">Central command interface for the OneGodian ecosystem.</p>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Access registry systems, planetary worlds, moon systems, OneGodian Time™, ODIN records, ecosystem
            infrastructure, media, tools, products, certificates, and profile services from one synchronized app
            interface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30" href="/dashboard">Open Dashboard</Link>
            <Link className="rounded-xl border border-slate-500/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-100" href="/registry">Explore Registry</Link>
            <Link className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20" href="/time">OneGodian Time™</Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {statusWidgets.map((widget) => (
            <article key={widget.label} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">{widget.label}</p>
              <p className="mt-2 text-sm font-semibold text-amber-100">{widget.value}</p>
            </article>
          ))}
        </section>

        {moduleGroups.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-200 sm:text-2xl">{group.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {group.cards.map((card) => (
                <Link key={card.title} href={card.href} className="group rounded-2xl border border-slate-700 bg-slate-900/70 p-5 transition hover:border-cyan-400/50 hover:bg-slate-900">
                  <p className="text-2xl">{card.glyph}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-100 group-hover:text-cyan-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.stats.map((stat) => (
                      <span key={stat} className="rounded-full border border-cyan-500/25 bg-slate-950 px-2.5 py-1 text-xs text-cyan-200">
                        {stat}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-cyan-200">App Wireframe</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            The OneGodian App organizes registry, planetary, timekeeping, media, product, and identity systems into one synchronized interface.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {appWireframe.map((node) => (
              <Link key={node.label} href={node.href} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-100">
                {node.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-amber-100">Flow: Dashboard → Registry → Planetary Systems → Time → Tools → Profile</p>
        </section>

        <section className="space-y-4 pb-4">
          <h2 className="text-2xl font-semibold text-cyan-200">Recent App Milestones</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {milestones.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
