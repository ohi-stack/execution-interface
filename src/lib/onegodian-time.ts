const OT_EPOCH_UTC_MS = Date.UTC(2025, 2, 18);
const DAY_MS = 24 * 60 * 60 * 1000;

export const OT_MONTHS = [
  'Genesis',
  'Wisdom',
  'Planting',
  'Justice',
  'Freedom',
  'Prosperity',
  'Innovation',
  'Transformation',
  'Remembrance',
  'Covenant',
  'Invention',
  'Independence',
  'Ascension'
] as const;

export type OTResult = {
  monthName: (typeof OT_MONTHS)[number];
  monthIndex: number;
  day: number;
  year: number;
  gregorianISODate: string;
  display: string;
};

export function isGregorianLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function isOTLeapYear(otYear: number) {
  const gregorianEndYear = 2025 + otYear + 1;
  return isGregorianLeapYear(gregorianEndYear);
}

export function daysInOTYear(otYear: number) {
  return isOTLeapYear(otYear) ? 366 : 365;
}

function toUTCDateOnly(value: Date) {
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

function normalizeInput(input: string | Date) {
  if (input instanceof Date) return input;
  return new Date(`${input}T00:00:00.000Z`);
}

export function gregorianToOT(input: string | Date): OTResult {
  const parsed = normalizeInput(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid Gregorian date input.');
  }

  const utcDateOnly = toUTCDateOnly(parsed);
  const deltaDays = Math.floor((utcDateOnly - OT_EPOCH_UTC_MS) / DAY_MS);

  if (deltaDays < 0) {
    throw new Error('Gregorian date must be on or after 2025-03-18.');
  }

  let remainingDays = deltaDays;
  let otYear = 0;

  while (remainingDays >= daysInOTYear(otYear)) {
    remainingDays -= daysInOTYear(otYear);
    otYear += 1;
  }

  const monthLengths = new Array(12).fill(30);
  monthLengths.push(isOTLeapYear(otYear) ? 6 : 5);

  let monthIndex = 0;
  while (remainingDays >= monthLengths[monthIndex]) {
    remainingDays -= monthLengths[monthIndex];
    monthIndex += 1;
  }

  const day = remainingDays + 1;
  const monthName = OT_MONTHS[monthIndex];
  const yearLabel = String(otYear).padStart(4, '0');
  const gregorianISODate = new Date(utcDateOnly).toISOString().slice(0, 10);
  const display = `${monthName} ${String(day).padStart(2, '0')}, ${yearLabel} OT`;

  return {
    monthName,
    monthIndex: monthIndex + 1,
    day,
    year: otYear,
    gregorianISODate,
    display
  };
}

export function formatOTDate(result: OTResult) {
  return result.display;
}

export function getCurrentOTDate() {
  return gregorianToOT(new Date());
}
