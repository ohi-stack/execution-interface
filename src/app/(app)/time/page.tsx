import { TodayInOneGodianTime } from '@/components/today-in-onegodian-time';

const timeRules = [
  'OTS-V5 is an internal OneGodian cultural/system chronology and presentation layer.',
  'Gregorian calendar dates remain controlling for legal, financial, tax, court, contractual, employment, regulatory, and governmental records.',
  'UTC timestamps remain the system truth for logs, APIs, storage, synchronization, audit trails, and cross-system coordination.',
  'Dual dating may display OneGodian Time beside Gregorian/UTC references, but it does not replace civil time obligations.'
];

export default function TimePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Corrected Timekeeping</p>
        <h1 className="mt-2 text-3xl font-semibold">OneGodian Time / OTS-V5</h1>
        <p className="mt-3 max-w-4xl text-slate-300">OTS-V5 presents OneGodian internal chronology while preserving Gregorian legal control and UTC system truth for production software and institutional records.</p>
      </section>
      <TodayInOneGodianTime />
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-xl font-semibold">Timekeeping Rules</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
          {timeRules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
        <a href="/time/dual-dating" className="mt-4 inline-block rounded-lg border border-cyan-400/50 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10">Open Dual Dating System</a>
      </section>
    </main>
  );
}
