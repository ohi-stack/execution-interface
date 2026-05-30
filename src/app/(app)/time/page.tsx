import { TodayInOneGodianTime } from '@/components/today-in-onegodian-time';

export default function TimePage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Chronology</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OneGodian Time™ / OTS-V5</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Dual-date display pairs OneGodian Time for internal presentation with Gregorian/UTC records for external and legal continuity.</p>
      </section>
      <section className="mobile-card">
        <TodayInOneGodianTime />
        <a href="/time/dual-dating" className="premium-button-secondary mt-5 inline-flex">Dual Dating System™</a>
      </section>
      <p className="rounded-2xl border border-gold-300/25 bg-gold-300/10 p-4 text-sm leading-6 text-gold-100">Legal safety: Gregorian Time and UTC timestamps remain controlling for legal, financial, tax, court, contractual, and institutional records.</p>
    </main>
  );
}
