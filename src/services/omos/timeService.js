const MS_PER_DAY = 24 * 60 * 60 * 1000;
const OT_EPOCH_UTC = new Date('2025-03-18T00:00:00.000Z');

const pad = (value, length = 2) => String(value).padStart(length, '0');

const isLeapYear = (year) => {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
};

const getOtYearStartUtc = (otYear) => new Date(Date.UTC(2025 + otYear, 2, 18, 0, 0, 0, 0));

const getOtYearLengthDays = (otYear) => {
  const gregorianYearAtOtEnd = 2025 + otYear + 1;
  return isLeapYear(gregorianYearAtOtEnd) ? 366 : 365;
};

export const utcToOt = (utcDateInput) => {
  const utcDate = new Date(utcDateInput);
  if (Number.isNaN(utcDate.getTime())) {
    throw new Error('Invalid UTC timestamp');
  }

  if (utcDate < OT_EPOCH_UTC) {
    throw new Error('UTC timestamp predates OT epoch (2025-03-18)');
  }

  let otYear = 0;
  let yearStart = OT_EPOCH_UTC;

  while (true) {
    const yearLength = getOtYearLengthDays(otYear);
    const nextStart = new Date(yearStart.getTime() + (yearLength * MS_PER_DAY));

    if (utcDate < nextStart) {
      break;
    }

    yearStart = nextStart;
    otYear += 1;
  }

  const elapsedDays = Math.floor((utcDate.getTime() - yearStart.getTime()) / MS_PER_DAY);
  const dayOfYear = elapsedDays + 1;

  return {
    year: otYear,
    dayOfYear,
    label: `Genesis ${pad(dayOfYear)}, ${pad(otYear, 4)} OT`,
  };
};

export const otToUtc = ({ year, dayOfYear }) => {
  if (!Number.isInteger(year) || year < 0) {
    throw new Error('OT year must be a non-negative integer');
  }
  if (!Number.isInteger(dayOfYear) || dayOfYear < 1) {
    throw new Error('OT dayOfYear must be a positive integer');
  }

  const yearLength = getOtYearLengthDays(year);
  if (dayOfYear > yearLength) {
    throw new Error(`OT dayOfYear exceeds year length (${yearLength})`);
  }

  const start = getOtYearStartUtc(year);
  return new Date(start.getTime() + ((dayOfYear - 1) * MS_PER_DAY));
};

export const buildTimestampRecord = (inputUtcIso) => {
  const timestampUtc = new Date(inputUtcIso);
  if (Number.isNaN(timestampUtc.getTime())) {
    throw new Error('timestamp_utc must be a valid ISO timestamp');
  }

  const timestampLocal = timestampUtc.toString();
  const timestampOt = utcToOt(timestampUtc.toISOString());

  return {
    timestamp_utc: timestampUtc.toISOString(),
    timestamp_local: timestampLocal,
    timestamp_ot: timestampOt.label,
    timestamp_ot_components: timestampOt,
  };
};
