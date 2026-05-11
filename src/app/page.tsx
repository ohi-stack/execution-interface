import Link from 'next/link';

export const metadata = {
  title: 'OneGodian App | Platform Command Surface',
  description:
    'The OneGodian platform command surface for registry systems, planetary canon, life intelligence, certificates, products, tools, games, capital systems, and execution environments.'
};

type MetricCard = {
  label: string;
  value: string;
  accent: string;
};

type StatusCard = {
  title: string;
  status: string;
  detail: string;
};

type OdinModule = {
  category: string;
  title: string;
  odinCode: string;
  productionStatus: string;
  priority: 'P0' | 'P1' | 'P2';
  visibility: 'Public' | 'Partner' | 'Internal';
  version: string;
  deploymentTarget: string;
  features: string[];
  nextActions: string;
  href: string;
};

const metricCards: MetricCard[] = [
  { label: 'Total Systems', value: '184', accent: 'text-cyan-300' },
  { label: 'Live Systems', value: '137', accent: 'text-emerald-300' },
  { label: 'Critical Systems', value: '12', accent: 'text-rose-300' },
  { label: 'Current Shell Version', value: 'OG-SH 3.2.1', accent: 'text-sky-300' }
];

const productionStatusCards: StatusCard[] = [
  { title: 'Node Runtime', status: 'Production Ready', detail: 'Clustered execution pipelines healthy across all gateway regions.' },
  { title: 'Systems Model', status: 'Live', detail: 'Registry indexing and lifecycle orchestration actively synchronized.' },
  { title: 'Galaxy Canon', status: 'Publishing', detail: 'Planetary canon entities, timeline contracts, and lore state deployed.' },
  { title: 'Capital Layer', status: 'Staged', detail: 'Treasury protocols and programmable allocation layers in controlled rollout.' }
];

const odinModules: OdinModule[] = [
  {
    category: 'Registry System',
    title: 'Sovereign Identity Registry',
    odinCode: 'ODIN-RGX-011',
    productionStatus: 'Live',
    priority: 'P0',
    visibility: 'Public',
    version: 'v5.4.0',
    deploymentTarget: 'global.identity.onegodian.com',
    features: ['Deterministic identity records', 'Membership graph federation', 'Certificate claim verification', 'Audit-grade event chronology'],
    nextActions: 'Ship delegated recovery flows and expand zk-proof policy templates.',
    href: '/modules/identity-registry'
  },
  {
    category: 'Planetary Canon',
    title: 'Galaxy Canon Navigator',
    odinCode: 'ODIN-CNX-204',
    productionStatus: 'Publishing',
    priority: 'P1',
    visibility: 'Public',
    version: 'v2.9.3',
    deploymentTarget: 'canon.onegodian.com/galaxy',
    features: ['Planetary lineage mapping', 'Canon timeline states', 'Narrative authority contracts', 'Cross-world citation engine'],
    nextActions: 'Publish sector atlas annotations and expose timeline diff viewer.',
    href: '/modules/galaxy-canon'
  },
  {
    category: 'Capital System',
    title: 'Execution Capital Matrix',
    odinCode: 'ODIN-CAP-077',
    productionStatus: 'Staged',
    priority: 'P0',
    visibility: 'Partner',
    version: 'v1.8.5',
    deploymentTarget: 'capital.onegodian.com/runtime',
    features: ['Programmatic treasury channels', 'Product and tool funding rails', 'Risk-aware allocation scoring', 'Runway and yield observability'],
    nextActions: 'Complete partner policy onboarding and enable automated circuit limits.',
    href: '/modules/capital-matrix'
  }
];

const statusClassName: Record<string, string> = {
  Live: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  Publishing: 'text-amber-200 border-amber-500/30 bg-amber-500/10',
  Staged: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
  'Production Ready': 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/25 p-8 shadow-2xl shadow-cyan-900/20 sm:p-12">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">ONEGODIAN PLATFORM · APP.ONEGODIAN.COM</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">OneGodian App Systems Model</h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-300">
            A production command surface for OneGodian registry systems, planetary canon intelligence, life intelligence engines,
            certificates, products, tools, games, capital systems, and execution environments. Operate every mission-critical
            layer from one unified ODIN-aware control plane.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ecosystem"
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Explore Ecosystem →
            </Link>
            <Link
              href="/galaxy"
              className="rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-100"
            >
              Open Galaxy Canon →
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{card.label}</p>
              <p className={`mt-3 text-3xl font-bold ${card.accent}`}>{card.value}</p>
            </article>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Production Status</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Realtime Platform Signals</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {productionStatusCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-700 bg-slate-900/65 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{card.title}</p>
                <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName[card.status]}`}>
                  {card.status}
                </p>
                <p className="mt-3 text-sm text-slate-300">{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">ODIN-Aware Modules</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Command Surface / Production</span>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {odinModules.map((module) => (
              <article key={module.odinCode} className="flex h-full flex-col rounded-2xl border border-cyan-900/40 bg-slate-900/70 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">{module.category}</p>
                    <h3 className="mt-2 text-lg font-semibold">{module.title}</h3>
                  </div>
                  <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-200">{module.odinCode}</span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-slate-400">Production Status</dt><dd className="font-medium text-slate-100">{module.productionStatus}</dd></div>
                  <div><dt className="text-slate-400">Priority</dt><dd className="font-medium text-slate-100">{module.priority}</dd></div>
                  <div><dt className="text-slate-400">Visibility</dt><dd className="font-medium text-slate-100">{module.visibility}</dd></div>
                  <div><dt className="text-slate-400">Version</dt><dd className="font-medium text-slate-100">{module.version}</dd></div>
                  <div className="col-span-2"><dt className="text-slate-400">Deployment Target</dt><dd className="font-medium text-slate-100">{module.deploymentTarget}</dd></div>
                </dl>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Features</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {module.features.slice(0, 4).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Next Actions</p>
                  <p className="mt-2 text-sm text-slate-300">{module.nextActions}</p>
                </div>

                <div className="mt-5">
                  <Link
                    href={module.href}
                    className="inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Open Module
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
