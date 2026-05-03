'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatOTDate, gregorianToOT } from '@/lib/onegodian-time';

export default function TimePage() {
  const [now, setNow] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const liveOT = useMemo(() => gregorianToOT(now), [now]);
  const converted = useMemo(() => gregorianToOT(selectedDate), [selectedDate]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 shadow-2xl shadow-blue-900/30">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300">OTS-V5 Dual-Date Governance System</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-50">OneGodian Time™</h1>
          <p className="mt-4 max-w-4xl text-slate-300">
            OneGodian Time converts Gregorian/UTC dates into a deterministic internal dual-date governance format.
            Gregorian Time controls legally. OneGodian Time is supplemental for internal governance, historical sequencing,
            and platform display.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-blue-300/20 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-blue-200">Live Dual-Date Clock</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-400">Local Gregorian:</span> {now.toLocaleString()}</p>
              <p><span className="text-slate-400">UTC Timestamp:</span> {now.toISOString()}</p>
              <p><span className="text-slate-400">OneGodian Time:</span> {formatOTDate(liveOT)}</p>
            </div>
          </article>

          <article className="rounded-2xl border border-blue-300/20 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-blue-200">Gregorian → OneGodian Converter</h2>
            <label className="mt-4 block text-sm text-slate-300">
              Gregorian Date
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                min="2025-03-18"
                className="mt-2 w-full rounded-xl border border-blue-300/20 bg-slate-950 p-2 text-slate-100"
              />
            </label>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>Gregorian date: {converted.gregorianISODate}</p>
              <p>OneGodian date: {converted.display}</p>
              <p>OT year: {String(converted.year).padStart(4, '0')}</p>
              <p>OT month: {converted.monthName} ({converted.monthIndex})</p>
              <p>OT day: {converted.day}</p>
              <p>System format: {converted.gregorianISODate} | {converted.display}</p>
            </div>
          </article>

          <article className="rounded-2xl border border-amber-300/20 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-amber-200">Epoch Anchor Card</h3>
            <p className="mt-3 text-sm text-slate-300">March 18, 2025 Gregorian</p>
            <p className="text-sm text-slate-300">Genesis 01, 0000 OT</p>
            <p className="mt-2 text-xs text-slate-400">Immutable conversion anchor.</p>
          </article>

          <article className="rounded-2xl border border-blue-300/20 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-blue-200">Calendar Structure Card</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>13 months total</li>
              <li>12 months × 30 days</li>
              <li>Ascension = 5 or 6 days</li>
              <li>Year length = 365 or 366 days</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-blue-300/20 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-blue-200">Database Governance Card</h3>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950/80 p-3 text-xs text-slate-300">{`timestamp_utc = primary truth
timestamp_local = display/local context
timestamp_ot = computed derivative
timezone = required`}</pre>
          </article>

          <article className="rounded-2xl border border-amber-300/20 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-amber-200">Legal-Safe Format Card</h3>
            <p className="mt-3 text-sm text-slate-300">Date: March 24, 2025</p>
            <p className="text-sm text-slate-300">OneGodian Date: Genesis 07, 0000 OT</p>
            <p className="mt-3 text-sm text-slate-300">
              Recorded on Genesis 07, 0000 OT (March 24, 2025), at 8:45 PM EST, Waterbury, Connecticut.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
