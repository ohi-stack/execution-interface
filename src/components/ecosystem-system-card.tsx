import type { EcosystemSystem } from '@/lib/ecosystem';

const STATUS_STYLES: Record<EcosystemSystem['status'], string> = {
  active: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  building: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  planned: 'bg-slate-500/20 text-slate-200 border-slate-400/30'
};

const PRIORITY_STYLES: Record<EcosystemSystem['syncPriority'], string> = {
  high: 'text-rose-300',
  medium: 'text-amber-300',
  low: 'text-cyan-300'
};

export function EcosystemSystemCard({ system }: { system: EcosystemSystem }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-neon">{system.name}</h2>
        <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[system.status]}`}>{system.status}</span>
      </div>

      <p className="mt-3 text-sm text-slate-400">{system.domain}</p>
      <p className="mt-1 text-sm text-slate-300">Category: {system.category}</p>
      <p className="mt-1 text-sm">Sync priority: <span className={`font-semibold uppercase ${PRIORITY_STYLES[system.syncPriority]}`}>{system.syncPriority}</span></p>
      <p className="mt-4 text-sm leading-6 text-slate-300">{system.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {system.syncTypes.map((syncType) => (
          <span key={syncType} className="rounded-md border border-slate-600 bg-slate-800/80 px-2 py-1 text-xs text-slate-200">
            {syncType}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <a href={system.primaryActionHref} className="inline-flex rounded-lg bg-neon px-4 py-2 text-sm font-semibold text-slate-950">
          {system.primaryActionLabel}
        </a>
      </div>
    </article>
  );
}
