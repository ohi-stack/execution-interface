const OT_EPOCH_UTC = Date.parse('2025-03-18T00:00:00Z');

export const toCanonicalUtcIso = (input) => new Date(input).toISOString();

export const getOtYearStartUtc = (otYear) => `${String(2025 + otYear).padStart(4, '0')}-03-18T00:00:00.000Z`;

export const getOtYearForDate = (dateInput) => {
  const iso = toCanonicalUtcIso(dateInput);
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const boundary = Date.parse(`${year}-03-18T00:00:00Z`);

  return date.getTime() >= boundary ? year - 2025 : year - 2026;
};

export const isOtLeapYear = (otYear) => {
  const gregorianYearWhenOtEnds = 2026 + otYear;
  return new Date(Date.UTC(gregorianYearWhenOtEnds, 1, 29)).getUTCDate() === 29;
};

export const toOtDate = (dateInput) => {
  const canonicalUtc = toCanonicalUtcIso(dateInput);
  const utcMs = Date.parse(canonicalUtc);
  if (Number.isNaN(utcMs) || utcMs < OT_EPOCH_UTC) {
    throw new Error('Date is before OT epoch');
  }

  const otYear = getOtYearForDate(canonicalUtc);
  const yearStartMs = Date.parse(getOtYearStartUtc(otYear));
  const dayIndex = Math.floor((utcMs - yearStartMs) / (1000 * 60 * 60 * 24));

  return {
    otYear,
    dayOfYear: dayIndex + 1,
    label: `Genesis ${String(dayIndex + 1).padStart(2, '0')}, ${String(otYear).padStart(4, '0')} OT`,
    canonicalUtc,
  };
};

export const getOtMonthLengths = (otYear) => ({
  genesis: 31,
  exodus: 30,
  covenant: 30,
  ascension: isOtLeapYear(otYear) ? 6 : 5,
});
