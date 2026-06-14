import { getCivilMonthDates, getOTDate } from '@/lib/ots-calendar';

const civilWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function OneGodianCalendar() {
  const today = new Date();
  const year = today.getUTCFullYear();
  const monthIndex = today.getUTCMonth();
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(today);
  const dates = getCivilMonthDates(year, monthIndex);

  return (
    <section className="rounded-[2rem] border border-[#D8B35A]/30 bg-white/[0.055] p-6 shadow-gold">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">OTS-V5 Calendar</p>
          <h2 className="mt-2 text-3xl font-black text-white">{monthLabel}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          Gregorian civil layout is preserved for public date reference; each cell is labeled with its OTS date and epoch-based day order.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {civilWeekdays.map((weekday) => <div key={weekday}>{weekday}</div>)}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {dates.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="min-h-28 rounded-2xl border border-white/5 bg-black/20" />;

          const ot = getOTDate(date);

          return (
            <article key={date.toISOString()} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-left">
              <p className="text-sm font-black text-white">{date.getUTCDate()}</p>
              <p className="mt-2 text-xs font-black text-[#F0D98A]">{ot.dayOrder}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">{ot.otDate}</p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">{ot.monthTheme}</p>
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Civil week headers remain Gregorian Sunday–Saturday for alignment with standard monthly grids. OTS day order does not use Date.getDay(); it advances from the OTS epoch with deltaDays % 7 so Skénra is Epoch Day 1.
      </p>
    </section>
  );
}
