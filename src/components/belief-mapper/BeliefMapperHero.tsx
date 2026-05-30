import Link from 'next/link';

export function BeliefMapperHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950 p-6 shadow-[0_0_60px_rgba(34,211,238,0.12)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.18),transparent_30%)]" />
      <div className="relative max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Belief Mapper™</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">Map your belief journey with care.</h1>
        <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
          A mobile-first swipe/tap experience that routes seekers, believers, Onegodians, and elders toward the next honest step without storing sensitive belief data unless consent is given.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/belief-mapper/start" className="inline-flex justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            Start Belief Mapper™
          </Link>
          <Link href="/belief-mapper/results" className="inline-flex justify-center rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200">
            View result paths
          </Link>
        </div>
      </div>
    </section>
  );
}
