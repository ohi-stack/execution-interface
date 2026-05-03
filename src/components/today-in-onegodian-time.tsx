'use client';

import { useEffect, useMemo, useState } from 'react';
import { gregorianToOT } from '@/lib/onegodian-time';

const DAY_NAMES = ['Skénra', 'Teyó·ra', 'Ahsténha', 'Yawénni', 'Onyá·ta', 'Shakó·wa', 'Niyóhsera'];
const OT_EPOCH_UTC_MS = Date.UTC(2025, 2, 18);
const DAY_MS = 24 * 60 * 60 * 1000;

export function TodayInOneGodianTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = useMemo(() => {
    const ot = gregorianToOT(now);
    const utcDateOnly = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dayIndex = Math.floor((utcDateOnly - OT_EPOCH_UTC_MS) / DAY_MS) + 1;
    const dayName = DAY_NAMES[(dayIndex - 1) % 7];
    return {
      gregorian: now.toLocaleDateString(),
      utc: now.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      otDate: ot.display,
      dayIndex,
      dayName
    };
  }, [now]);

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <h2 className="text-lg font-semibold text-cyan-200">Today in OneGodian Time</h2>
      <dl className="mt-3 space-y-1 text-sm text-slate-200">
        <div><dt className="inline text-slate-400">Gregorian:</dt> <dd className="inline">{data.gregorian}</dd></div>
        <div><dt className="inline text-slate-400">UTC:</dt> <dd className="inline">{data.utc}</dd></div>
        <div><dt className="inline text-slate-400">Timezone:</dt> <dd className="inline">{data.timezone}</dd></div>
        <div><dt className="inline text-slate-400">OT Date:</dt> <dd className="inline">{data.otDate}</dd></div>
        <div><dt className="inline text-slate-400">OT Day Index:</dt> <dd className="inline">{data.dayIndex}</dd></div>
        <div><dt className="inline text-slate-400">OT Day Name:</dt> <dd className="inline">{data.dayName}</dd></div>
      </dl>
    </article>
  );
}
