import type { ReactNode } from 'react';

export function ModuleHeader({ title, description, cta }: { title: string; description: string; cta?: ReactNode }) {
  return (
    <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
      <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
      <p className="mt-3 max-w-4xl text-slate-300">{description}</p>
      {cta ? <div className="mt-4">{cta}</div> : null}
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-200">{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const tone = priority === 'Critical' ? 'border-red-400/60 bg-red-500/10 text-red-200' : priority === 'High' ? 'border-amber-400/60 bg-amber-500/10 text-amber-200' : 'border-slate-500/70 bg-slate-800 text-slate-200';
  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${tone}`}>{priority}</span>;
}

export function ChecklistCard({ title = 'Production Checklist', items }: { title?: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
