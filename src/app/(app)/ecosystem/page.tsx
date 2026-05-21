import { EcosystemSystemCard } from '@/components/ecosystem-system-card';
import {
  ECOSYSTEM_CATEGORIES,
  ONEGODIAN_ECOSYSTEM,
  PRIORITIES,
  PRODUCTION_STATUSES,
  ecosystemSummary,
  type EcosystemCategory,
  type Priority,
  type ProductionStatus
} from '@/lib/ecosystem';

const normalizeParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default function EcosystemPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const category = normalizeParam(searchParams?.category) as EcosystemCategory | 'all' | undefined;
  const productionStatus = normalizeParam(searchParams?.productionStatus) as ProductionStatus | 'all' | undefined;
  const priority = normalizeParam(searchParams?.priority) as Priority | 'all' | undefined;

  const systems = ONEGODIAN_ECOSYSTEM.filter((system) => {
    const categoryMatch = !category || category === 'all' || system.category === category;
    const statusMatch = !productionStatus || productionStatus === 'all' || system.productionStatus === productionStatus;
    const priorityMatch = !priority || priority === 'all' || system.priority === priority;

    return categoryMatch && statusMatch && priorityMatch;
  });

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(2,6,23,.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.28em] text-neon">OneGodian Platform · App.OneGodian.com</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">System Command Dashboard</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Visual production command layer for the OneGodian ecosystem. Track live systems, deployment targets,
            repositories, health endpoints, priorities, and next actions from one operational surface.
          </p>
        </header>

        <section aria-label="Production summary" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Total Systems', ecosystemSummary.totalSystems],
            ['Live Systems', ecosystemSummary.liveSystems],
            ['Critical Systems', ecosystemSummary.criticalSystems],
            ['Needs Setup', ecosystemSummary.needsSetup]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">{label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-50">{value}</p>
            </div>
          ))}
        </section>

        <section aria-label="Filters" className="mt-10 rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Filters</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <FilterGroup label="Category" param="category" values={ECOSYSTEM_CATEGORIES} active={category} />
            <FilterGroup label="Production Status" param="productionStatus" values={PRODUCTION_STATUSES} active={productionStatus} />
            <FilterGroup label="Priority" param="priority" values={PRIORITIES} active={priority} />
          </div>
        </section>

        <section aria-label="Ecosystem systems" className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {systems.map((system) => (
            <EcosystemSystemCard key={system.id} system={system} />
          ))}
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ label, param, values, active }: { label: string; param: string; values: string[]; active?: string }) {
  const options = ['all', ...values];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((value) => {
          const isActive = (!active && value === 'all') || active === value;
          return (
            <a
              key={value}
              href={value === 'all' ? '/ecosystem' : `/ecosystem?${param}=${encodeURIComponent(value)}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'border-cyan-300/60 bg-cyan-300/15 text-cyan-100'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-100'
              }`}
            >
              {value}
            </a>
          );
        })}
      </div>
    </div>
  );
}
