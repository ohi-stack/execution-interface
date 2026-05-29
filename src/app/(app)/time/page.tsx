import { TodayInOneGodianTime } from '@/components/today-in-onegodian-time';

export default function TimePage() {
  return (
    <main className="p-6 text-slate-100 space-y-4">
      <h1 className="text-3xl font-semibold">OneGodian Time™ / OTS-V5</h1>
      <p className="text-slate-300">Dual-date display pairs OneGodian Time for internal presentation with Gregorian/UTC records for external and legal continuity.</p>
      <TodayInOneGodianTime />
      <a href="/time/dual-dating" className="inline-block rounded-lg border border-cyan-400/50 bg-slate-900/70 px-4 py-2 text-cyan-200 transition hover:bg-cyan-500/10">Dual Dating System™</a>
      <p className="text-sm text-amber-200">Legal safety: Gregorian Time and UTC timestamps remain controlling for legal, financial, tax, court, contractual, and institutional records.</p>
    </main>
  );
}
