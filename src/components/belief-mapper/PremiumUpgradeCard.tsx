import Link from 'next/link';

export function PremiumUpgradeCard() {
  return (
    <aside className="rounded-3xl border border-amber-300/40 bg-amber-500/10 p-5 text-amber-50">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Premium pathway</p>
      <h2 className="mt-2 text-2xl font-bold">Unlock deeper mapping</h2>
      <p className="mt-3 text-sm leading-6 text-amber-100/90">
        Add saved profiles, extended timelines, certificate readiness prompts, group facilitation resources, and advanced journal insights.
      </p>
      <Link href="/belief-mapper/premium" className="mt-5 inline-flex rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-100">
        Explore Premium
      </Link>
    </aside>
  );
}
