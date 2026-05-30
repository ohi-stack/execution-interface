import Link from 'next/link';
import { PremiumUpgradeCard } from '@/components/belief-mapper/PremiumUpgradeCard';

export default function BeliefMapperProfilePage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Consent-first belief profile</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">The profile area is designed for saved stage, next route, certificate readiness, journal checkpoints, and member path links after consent.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/belief-mapper/start" className="rounded-full bg-cyan-300 px-4 py-3 text-center text-sm font-semibold text-slate-950">Retake mapper</Link>
          <Link href="/belief-mapper/journal" className="rounded-full border border-slate-600 px-4 py-3 text-center text-sm font-semibold text-slate-200">Open journal</Link>
        </div>
      </section>
      <PremiumUpgradeCard />
    </main>
  );
}
