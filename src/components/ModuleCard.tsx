import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import type { consoleModules } from '@/lib/acc-content';

type Module = (typeof consoleModules)[number];

export function ModuleCard({ module }: { module: Module }) {
  return (
    <Link href={module.href} className="group block rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-black tracking-tight text-white">{module.title}</h3>
        <StatusBadge status={module.status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{module.description}</p>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 group-hover:text-cyan-100">Open module →</p>
    </Link>
  );
}
