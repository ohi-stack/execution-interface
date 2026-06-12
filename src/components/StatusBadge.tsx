import type { AppStatus } from '@/lib/acc-content';

const labels: Record<AppStatus, string> = {
  live: 'Live',
  available: 'Available',
  'plugin-bridge': 'Plugin Bridge',
  'coming-soon': 'Coming Soon'
};

const classes: Record<AppStatus, string> = {
  live: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
  available: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
  'plugin-bridge': 'border-purple-300/45 bg-purple-400/10 text-purple-100',
  'coming-soon': 'border-slate-300/30 bg-slate-300/10 text-slate-200'
};

export function StatusBadge({ status }: { status: AppStatus }) {
  return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${classes[status]}`}>{labels[status]}</span>;
}
