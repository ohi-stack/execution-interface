import Link from 'next/link';

export const metadata = {
  title: 'OneGodian App | Platform Command Surface',
  description:
    'The OneGodian platform command surface for the seven-property digital ecosystem foundation, system bridges, and production readiness telemetry.'
};

type EcosystemCard = {
  name: string;
  role: string;
  href: string;
  status: 'Operational' | 'Linking' | 'Documenting' | 'Stabilizing';
  readiness: number;
  detail: string;
};

type SystemCard = {
  title: string;
  detail: string;
  href: string;
  status: 'Live' | 'In Progress' | 'Attention';
  readiness: number;
};

const ecosystemCards: EcosystemCard[] = [
  {
    name: 'OneGodian.org',
    role: 'Organization',
    href: 'https://onegodian.org',
    status: 'Operational',
    readiness: 92,
    detail: 'Public mission, history, records, membership, and institutional education base.'
  },
  {
    name: 'OneGodian.com',
    role: 'Store',
    href: 'https://onegodian.com',
    status: 'Operational',
    readiness: 89,
    detail: 'Products, merchandise, certificates, digital downloads, and campaign commerce.'
  },
  {
    name: 'u.OneGodian.com',
    role: 'Education',
    href: 'https://u.onegodian.com',
    status: 'Linking',
    readiness: 82,
    detail: 'University LMS for courses, lessons, learning paths, and training certificates.'
  },
  {
    name: 'galaxy.OneGodian.com',
    role: 'Galaxy / Planets',
    href: 'https://galaxy.onegodian.com',
    status: 'Linking',
    readiness: 80,
    detail: 'Galaxy console, planet navigator, planet stores, lore, and gateway navigation.'
  },
  {
    name: 'capital.OneGodian.com',
    role: 'Corporate Finance',
    href: 'https://capital.onegodian.com',
    status: 'Documenting',
    readiness: 77,
    detail: 'Corporate finance materials, funding pages, capital strategy, and contributors.'
  },
  {
    name: 'OMOS.OneGodian.com',
    role: 'Protocol / Specification / Alignment System',
    href: 'https://omos.onegodian.com',
    status: 'Stabilizing',
    readiness: 75,
    detail: 'OMOS-1.0 protocol docs, Alignment API, dev specification, and alignment framework.'
  },
  {
    name: 'app.OneGodian.com',
    role: 'Node Control Plane',
    href: 'https://app.onegodian.com',
    status: 'Operational',
    readiness: 94,
    detail: 'Repository-connected command center mirroring all ecosystem systems and bridges.'
  }
];

const systemCards: SystemCard[] = [
  {
    title: 'Repositories',
    detail: 'GitHub sync and deployment status across app, plugins, API, and runtime repos.',
    href: 'https://github.com',
    status: 'In Progress',
    readiness: 84
  },
  {
    title: 'Plugin Status',
    detail: 'WordPress plugin bridge status for Store, University, Capital, and OMOS integrations.',
    href: '/ecosystem',
    status: 'In Progress',
    readiness: 79
  },
  {
    title: 'API Health',
    detail: 'Node endpoint checks, bridge heartbeat, and control-plane service availability.',
    href: '/status',
    status: 'Live',
    readiness: 90
  }
];

const statusClassName: Record<string, string> = {
  Operational: 'text-emerald-200 border-emerald-500/30 bg-emerald-500/10',
  Linking: 'text-cyan-200 border-cyan-500/30 bg-cyan-500/10',
  Documenting: 'text-amber-200 border-amber-500/30 bg-amber-500/10',
  Stabilizing: 'text-violet-200 border-violet-500/30 bg-violet-500/10',
  Live: 'text-emerald-200 border-emerald-500/30 bg-emerald-500/10',
  'In Progress': 'text-cyan-200 border-cyan-500/30 bg-cyan-500/10',
  Attention: 'text-rose-200 border-rose-500/30 bg-rose-500/10'
};

function readinessLabel(value: number) {
  if (value >= 90) return 'Production Stable';
  if (value >= 80) return 'Near Production';
  return 'Stabilizing';
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/25 p-6 shadow-2xl shadow-cyan-900/20 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">APP.ONEGODIAN.COM · NODE CONTROL PLANE</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">OneGodian Digital Ecosystem</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Production baseline: the Seven-Property OneGodian Digital Ecosystem. This control plane remains the governing structure until all seven
            properties are operational, clearly linked, documented, mirrored, bridge-connected, and production-stable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://onegodian.org" className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20">Open Organization</a>
            <a href="https://onegodian.com" className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20">Open Store</a>
            <a href="https://app.onegodian.com" className="rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-100">Open Control Plane</a>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Seven-Property Foundation</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Production Baseline</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ecosystemCards.map((card) => (
              <article key={card.name} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">{card.role}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{card.name}</h3>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName[card.status]}`}>{card.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{card.detail}</p>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                    <span>Production readiness</span>
                    <span>{card.readiness}% · {readinessLabel(card.readiness)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${card.readiness}%` }} />
                  </div>
                </div>
                <a href={card.href} className="mt-4 inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20">External Link ↗</a>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">System Operations</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Bridge & Runtime Status</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {systemCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-700 bg-slate-900/65 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{card.title} Card</p>
                <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName[card.status]}`}>{card.status}</p>
                <p className="mt-3 text-sm text-slate-300">{card.detail}</p>
                <p className="mt-3 text-xs text-cyan-200">Readiness: {card.readiness}% · {readinessLabel(card.readiness)}</p>
                <Link href={card.href} className="mt-4 inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20">Open Card</Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
