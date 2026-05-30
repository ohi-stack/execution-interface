import type { ReactNode } from 'react';

export function ModuleHeader({ title, description, cta }: { title: string; description: string; cta?: ReactNode }) {
  return (
    <header className="glass-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">OneGodian Module</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">{title}</h1>
      <p className="mt-3 max-w-4xl leading-7 text-slate-300">{description}</p>
      {cta ? <div className="mt-5">{cta}</div> : null}
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className="rounded-full border border-gold-300/50 bg-gold-300/10 px-2.5 py-1 text-xs font-bold text-gold-100">{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const tone = priority === 'Critical' ? 'border-red-300/60 bg-red-500/10 text-red-100' : priority === 'High' ? 'border-gold-300/60 bg-gold-300/10 text-gold-100' : 'border-purple-300/40 bg-purple-300/10 text-purple-100';
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>{priority}</span>;
}

export function ChecklistCard({ title = 'Production Checklist', items }: { title?: string; items: string[] }) {
  return (
    <section className="mobile-card">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
