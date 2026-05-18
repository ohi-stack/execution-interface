import Link from 'next/link';
import {
  Boxes,
  BrainCircuit,
  Building2,
  CircleDollarSign,
  Database,
  GraduationCap,
  Network,
  Orbit,
  Radio,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import type { EcosystemSystem, IconKey, Priority, ProductionStatus } from '@/lib/ecosystem';

const statusStyles: Record<ProductionStatus, string> = {
  Live: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200',
  Staging: 'border-cyan-400/35 bg-cyan-400/10 text-cyan-200',
  'In Development': 'border-violet-400/35 bg-violet-400/10 text-violet-200',
  'Needs Setup': 'border-amber-400/35 bg-amber-400/10 text-amber-200',
  Offline: 'border-red-400/35 bg-red-400/10 text-red-200',
  Planned: 'border-slate-400/35 bg-slate-400/10 text-slate-200'
};

const priorityStyles: Record<Priority, string> = {
  Critical: 'border-red-400/35 bg-red-400/10 text-red-200',
  High: 'border-orange-400/35 bg-orange-400/10 text-orange-200',
  Medium: 'border-cyan-400/35 bg-cyan-400/10 text-cyan-200',
  Low: 'border-slate-400/35 bg-slate-400/10 text-slate-200'
};

const iconMap = {
  gateway: Network,
  identity: BrainCircuit,
  registry: Boxes,
  commerce: CircleDollarSign,
  education: GraduationCap,
  media: Radio,
  shield: ShieldCheck,
  planet: Orbit,
  database: Database,
  workflow: Workflow
} satisfies Record<IconKey, typeof Network>;

export function SystemIcon({ iconKey }: { iconKey: IconKey }) {
  const Icon = iconMap[iconKey] ?? Building2;

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.14)]">
      <Icon className="h-6 w-6 text-cyan-200" aria-hidden="true" />
    </div>
  );
}

export function StatusBadge({ status }: { status: ProductionStatus }) {
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusStyles[status]}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${priorityStyles[priority]}`}>{priority}</span>;
}

export function EcosystemSystemCard({ system }: { system: EcosystemSystem }) {
  return (
    <Link
      href={`/ecosystem/${system.slug}`}
      className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-[0_0_38px_rgba(34,211,238,0.18)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.14),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
      <div className="relative flex items-start justify-between gap-4">
        <SystemIcon iconKey={system.iconKey} />
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge status={system.productionStatus} />
          <PriorityBadge priority={system.priority} />
        </div>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">{system.id}</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-50">{system.name}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{system.description}</p>

        <div className="mt-4 grid gap-2 text-xs text-slate-400">
          <p><span className="text-slate-200">Domain:</span> {system.domain}</p>
          <p><span className="text-slate-200">Repo:</span> {system.repo}</p>
          <p><span className="text-slate-200">Last check:</span> {system.lastCheckedLabel}</p>
        </div>

        <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200 transition-colors group-hover:text-white">
          Open System →
        </span>
      </div>
    </Link>
  );
}
