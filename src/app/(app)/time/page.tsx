import { TodayInOneGodianTime } from '@/components/today-in-onegodian-time';

export default function TimePage() {
  return (
    <main className="p-6 text-slate-100 space-y-4">
      <h1 className="text-3xl font-semibold">OneGodian Time™ / OTS-V5</h1>
      <p className="text-slate-300">Dual-date display pairs OneGodian Time for internal presentation with Gregorian/UTC records for external and legal continuity.</p>
      <TodayInOneGodianTime />
      <a href="/time/dual-dating" className="inline-block rounded-lg border border-cyan-400/50 bg-slate-900/70 px-4 py-2 text-cyan-200 transition hover:bg-cyan-500/10">Dual Dating System™</a>
      <p className="text-sm text-amber-200">Legal safety: Gregorian Time and UTC timestamps remain controlling for legal, financial, tax, court, contractual, and institutional records.</p>
export default function Page() {
  const gregorian = new Date().toISOString().slice(0, 10);
  const ots = 'OTS-V5 active chronology view';
  return <main className="space-y-6"><h1 className="text-3xl font-bold">OneGodian Time™ · OTS-V5</h1><p className="text-slate-300">Dual-date view for platform coordination and historical references.</p><div className="grid gap-4 md:grid-cols-2"><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="text-cyan-200">Gregorian Date</h2><p className="mt-2 text-slate-100">{gregorian}</p></article><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="text-cyan-200">OneGodian Date</h2><p className="mt-2 text-slate-100">{ots}</p></article></div><p className="text-sm text-slate-400">Legal safety notice: OneGodian Time™ is an internal cultural/system chronology aid. It does not replace legal, regulatory, tax, court, banking, or governmental date standards.</p></main>;
export default function TimePage() {
  return (
    <main className="space-y-6 p-6 text-slate-100">
      <h1 className="text-3xl font-semibold">OneGodian Time™ / OTS-V5</h1>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-300 space-y-2">
        <p>Dual-date display model: Gregorian civil date + OneGodian internal date notation for synchronized cultural references.</p>
        <p>Example format: Gregorian Date (UTC) · OneGodian Date (OTS-V5 internal).</p>
      </section>
      <p className="text-sm text-amber-200">Legal safety: Gregorian calendar/time remains controlling for legal, financial, compliance, and external institutional matters.</p>
    </main>
  );
}
