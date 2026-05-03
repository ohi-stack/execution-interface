import Link from 'next/link';

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
      </div>
    </main>
  );
}
