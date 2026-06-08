import type { AccStatus } from '@/lib/acc-content';

const labels: Record<AccStatus, string> = {
  live: 'Live',
  'external-authority': 'External Authority',
  watch: 'Watch',
  planned: 'Planned'
};

const classes: Record<AccStatus, string> = {
  live: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
  'external-authority': 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100',
  watch: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  planned: 'border-slate-300/30 bg-slate-300/10 text-slate-200'
};

export function StatusBadge({ status }: { status: AccStatus }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${classes[status]}`}>{labels[status]}</span>;
}
