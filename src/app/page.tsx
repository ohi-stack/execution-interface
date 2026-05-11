import Link from 'next/link';
import {
  appModules,
  criticalSystems,
  liveSystems,
  type Priority,
  type ProductionStatus
} from '@/lib/app-modules';

type StatusItem = {
  title: string;
  state: string;
  description: string;
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

const productionStatus: StatusItem[] = [
  {
    title: 'Node Runtime',
    state: 'Live',
    description: 'Primary Next.js production interface online and serving app.onegodian.com.'
  },
  {
    title: 'Systems Model',
    state: 'Operational',
    description: 'Typed OneGodian systems registry and modular platform architecture active.'
  },
  {
    title: 'Galaxy Canon',
    state: 'In Development',
    description: 'Planetary registry, orbital systems, and life-intelligence structures expanding.'
  },
  {
    title: 'Capital Layer',
    state: 'Connected',
    description: 'OneGodian Capital integration planning and commerce routing underway.'
  }
];

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">ONEGODIAN PLATFORM · APP.ONEGODIAN.COM</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              OneGodian App Systems Model
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Central interface layer for navigation, registry systems, planetary canon, life intelligence, certificates,
              products, utilities, games, capital systems, and future execution environments.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ecosystem"
                className="rounded-xl border border-cyan-400/60 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                Explore Ecosystem
              </Link>

              <Link
                href="/galaxy"
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50"
              >
                Open Galaxy Canon
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Systems</p>
              <p className="mt-2 text-3xl font-black text-white">{appModules.length}</p>
              <p className="mt-1 text-xs text-slate-400">Connected platform modules</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Live</p>
              <p className="mt-2 text-3xl font-black text-white">{liveSystems.length}</p>
              <p className="mt-1 text-xs text-slate-400">Operational systems</p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-red-300">Critical</p>
              <p className="mt-2 text-3xl font-black text-white">{criticalSystems.length}</p>
              <p className="mt-1 text-xs text-slate-400">Priority systems</p>
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Version</p>
              <p className="mt-2 text-3xl font-black text-white">0.2</p>
              <p className="mt-1 text-xs text-slate-400">Production shell</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productionStatus.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-200">
                {item.state}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">SYSTEM DIRECTORY</p>
            <h2 className="mt-2 text-3xl font-black text-white">Platform Modules</h2>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs text-slate-400">
            Typed registry architecture active · Modular expansion enabled
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appModules.map((module) => (
            <article
              key={module.slug}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-500/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                    {module.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {module.shortTitle ?? module.title}
                  </h2>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ODIN</p>
                  <p className="mt-1 text-xs font-semibold text-cyan-200">{module.odinCode}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {module.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                <span className={`rounded-full border px-2 py-1 ${statusStyles[module.productionStatus]}`}>
                  {module.productionStatus}
                </span>

                <span className={`rounded-full border px-2 py-1 ${priorityStyles[module.priority]}`}>
                  {module.priority} Priority
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-slate-300">
                  {module.visibility}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
                <div>
                  <p className="uppercase tracking-[0.18em] text-slate-500">Version</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {module.version ?? '0.1'}
                  </p>
                </div>

                <div>
                  <p className="uppercase tracking-[0.18em] text-slate-500">Deployment</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {module.deploymentTarget ?? 'Pending'}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-1 text-sm text-slate-300">
                {module.features.slice(0, 4).map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              {module.nextActions?.length ? (
                <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                    Next Actions
                  </p>

                  <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {module.nextActions.map((action) => (
                      <li key={action}>• {action}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  {module.lastCheckedLabel ?? 'System registry synchronized'}
                </div>

                <Link
                  href={module.route}
                  className="inline-flex rounded-xl border border-cyan-400/70 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/10"
                >
                  Open Module
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
