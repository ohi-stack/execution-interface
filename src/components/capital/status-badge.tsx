import { CapitalStatus } from '@/lib/capital';

const styles: Record<CapitalStatus, string> = {
  Active: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
  'Development-stage': 'bg-amber-500/20 text-amber-300 border-amber-400/50',
  Planned: 'bg-sky-500/20 text-sky-300 border-sky-400/50',
  'Compliance Review': 'bg-violet-500/20 text-violet-300 border-violet-400/50',
  Paused: 'bg-slate-500/20 text-slate-300 border-slate-400/50',
  Closed: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
  'Needs API': 'bg-orange-500/20 text-orange-300 border-orange-400/50'
};

export function CapitalStatusBadge({ status }: { status: CapitalStatus }) {
  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
