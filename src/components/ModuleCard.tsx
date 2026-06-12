import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import type { dashboardModules } from '@/lib/acc-content';

type Module = (typeof dashboardModules)[number];

export function ModuleCard({ module }: { module: Module }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-amber-300/45 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-black tracking-tight text-white">{module.title}</h3>
        <StatusBadge status={module.status} />
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-300">{module.description}</p>
      <Link href={module.href} className="mt-5 inline-flex w-fit rounded-full border border-amber-200/50 bg-amber-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-100">
        Open
      </Link>
    </article>
  );
}
