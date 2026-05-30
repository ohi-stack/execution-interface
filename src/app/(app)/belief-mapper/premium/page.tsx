import { PremiumUpgradeCard } from '@/components/belief-mapper/PremiumUpgradeCard';

const premiumFeatures = ['Extended question bank', 'Saved profile timeline', 'Certificate readiness tracker', 'Group facilitation mode', 'Journal insight prompts', 'Member pathway reminders'];

export default function BeliefMapperPremiumPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
      <PremiumUpgradeCard />
      <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Premium</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Advanced Belief Mapper™ tools</h1>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {premiumFeatures.map((feature) => (
            <li key={feature} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-200">{feature}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
