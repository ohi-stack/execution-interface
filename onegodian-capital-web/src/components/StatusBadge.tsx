type Status = 'active' | 'pending' | 'review' | 'archived';

export default function StatusBadge({ status }: { status: Status }) {
  const tone = {
    active: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    review: 'bg-blue-100 text-blue-800',
    archived: 'bg-slate-200 text-slate-700',
  }[status];

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${tone}`}>{status}</span>;
}
