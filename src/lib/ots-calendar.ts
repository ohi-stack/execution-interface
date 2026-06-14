export const OG_DAYS = [
  'Skénra',
  'Auren',
  'Veyra',
  'Thalen',
  'Omira',
  'Kael',
  'Solun'
] as const;

export const OG_MONTHS = [
  { name: 'Auralis', theme: 'Alignment' },
  { name: 'Brennar', theme: 'Foundation' },
  { name: 'Caelora', theme: 'Clarity' },
  { name: 'Deymar', theme: 'Discipline' },
  { name: 'Elyth', theme: 'Growth' },
  { name: 'Faelion', theme: 'Service' },
  { name: 'Galdra', theme: 'Wisdom' },
  { name: 'Hesper', theme: 'Stewardship' },
  { name: 'Ilyra', theme: 'Renewal' },
  { name: 'Jorren', theme: 'Creation' },
  { name: 'Kaelith', theme: 'Community' },
  { name: 'Lumora', theme: 'Completion' }
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const OTS_EPOCH_UTC = Date.UTC(2026, 0, 1);
const DAYS_PER_OT_MONTH = 30;
const DAYS_PER_OT_YEAR = OG_MONTHS.length * DAYS_PER_OT_MONTH;

export type OTDate = {
  valid: boolean;
  otYear: number;
  otMonth: string;
  otDay: number;
  otDate: string;
  dayOrder: (typeof OG_DAYS)[number];
  monthTheme: string;
};

export function getOTDate(input = new Date()): OTDate {
  const utcDateOnly = Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate());
  const deltaDays = Math.floor((utcDateOnly - OTS_EPOCH_UTC) / DAY_MS);
  const normalizedDays = ((deltaDays % DAYS_PER_OT_YEAR) + DAYS_PER_OT_YEAR) % DAYS_PER_OT_YEAR;
  const otYear = Math.floor(deltaDays / DAYS_PER_OT_YEAR) + 1;
  const monthIndex = Math.floor(normalizedDays / DAYS_PER_OT_MONTH);
  const otDay = (normalizedDays % DAYS_PER_OT_MONTH) + 1;
  // OTS day order is an internal epoch sequence: Epoch Day 1 is Skénra,
  // then the names continue on a fixed 7-day cycle independent of Gregorian weekdays.
  const dayIndex = ((deltaDays % 7) + 7) % 7;

  return {
    valid: true,
    otYear,
    otMonth: OG_MONTHS[monthIndex].name,
    otDay,
    otDate: `${OG_MONTHS[monthIndex].name} ${String(otDay).padStart(2, '0')}, ${String(otYear).padStart(4, '0')} OT`,
    dayOrder: OG_DAYS[dayIndex],
    monthTheme: OG_MONTHS[monthIndex].theme
  };
}

export function getCivilMonthDates(year: number, monthIndex: number) {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const startOffset = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  return Array.from({ length: startOffset + daysInMonth }, (_, index) => {
    if (index < startOffset) return null;
    return new Date(Date.UTC(year, monthIndex, index - startOffset + 1));
  });
}
