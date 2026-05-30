import Link from 'next/link';
import type { BeliefMapperResult } from '@/lib/beliefMapper/scoring';

const colorClasses: Record<string, string> = {
  cyan: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100',
  violet: 'border-violet-400/40 bg-violet-500/10 text-violet-100',
  emerald: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
  amber: 'border-amber-400/40 bg-amber-500/10 text-amber-100'
};

export function ResultCard({ result }: { result: BeliefMapperResult }) {
  return (
    <article className={`rounded-3xl border p-5 ${colorClasses[result.color] ?? colorClasses.cyan}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">Your current profile</p>
      <h2 className="mt-2 text-3xl font-bold">{result.title}</h2>
      <p className="mt-3 text-sm leading-6 opacity-90">{result.summary}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-100">{result.guidance}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {result.recommendedRoutes.map((route) => (
          <Link key={route} href={route} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-white/50">
            {route}
          </Link>
        ))}
      </div>
    </article>
  );
}
