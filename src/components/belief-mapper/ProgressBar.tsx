export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2" aria-label={label ?? 'Belief Mapper progress'}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span>{label ?? 'Progress'}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-200 transition-all" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
