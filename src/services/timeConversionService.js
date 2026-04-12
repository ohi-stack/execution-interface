import {
  FIXED_MONTH_COUNT,
  FIXED_MONTH_LENGTH,
  OT_DAY_ORDER,
  OT_EPOCH_DATE,
  OT_MONTH_NAMES,
} from '../constants/otCalendar.js';

const MS_PER_DAY = 86_400_000;

const GREGORIAN_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatterCache = new Map();

const getFormatter = (timezone) => {
  if (!formatterCache.has(timezone)) {
    formatterCache.set(timezone, new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'long',
    }));
  }

  return formatterCache.get(timezone);
};

const isGregorianLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const assertValidTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
  } catch {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
};

const normalizeDateInput = (inputDate) => {
  const date = inputDate instanceof Date ? new Date(inputDate.getTime()) : new Date(inputDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid inputDate. Provide an ISO-8601 string or JavaScript Date value.');
  }

  return date;
};

const getDatePartsInTimezone = (date, timezone) => {
  const formatter = getFormatter(timezone);
  const parts = formatter.formatToParts(date);

  const pick = (type) => parts.find((part) => part.type === type)?.value;

  const year = Number(pick('year'));
  const month = Number(pick('month'));
  const day = Number(pick('day'));
  const hour = pick('hour');
  const minute = pick('minute');
  const second = pick('second');
  const weekday = pick('weekday');

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday,
    localTimestamp: `${year.toString().padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hour}:${minute}:${second}`,
    gregorianDate: `${year.toString().padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
};

const getDayIndexFromGregorianDate = (year, month, day) => new Date(Date.UTC(year, month - 1, day)).getUTCDay();

export const isOTLeapYear = (otYear) => {
  if (!Number.isInteger(otYear) || otYear < 0) {
    throw new Error('otYear must be a non-negative integer.');
  }

  const gregorianYearInWhichOTEnds = 2026 + otYear;
  return isGregorianLeapYear(gregorianYearInWhichOTEnds);
};

export const daysInOTYear = (otYear) => (isOTLeapYear(otYear) ? 366 : 365);

const getDaysFromEpochToOTYearStart = (otYear) => {
  let total = 0;

  for (let year = 0; year < otYear; year += 1) {
    total += daysInOTYear(year);
  }

  return total;
};

export const gregorianToOT = (inputDate, timezone = 'UTC') => {
  assertValidTimezone(timezone);
  const instant = normalizeDateInput(inputDate);
  const localParts = getDatePartsInTimezone(instant, timezone);

  const normalizedGregorianUtc = new Date(Date.UTC(localParts.year, localParts.month - 1, localParts.day));

  const daysSinceEpoch = Math.floor((normalizedGregorianUtc.getTime() - OT_EPOCH_DATE.getTime()) / MS_PER_DAY);

  if (daysSinceEpoch < 0) {
    throw new Error('Gregorian date precedes OT epoch (2025-03-18 UTC).');
  }

  let remainingDays = daysSinceEpoch;
  let otYear = 0;

  while (remainingDays >= daysInOTYear(otYear)) {
    remainingDays -= daysInOTYear(otYear);
    otYear += 1;
  }

  const firstTwelveMonths = FIXED_MONTH_COUNT * FIXED_MONTH_LENGTH;
  const otMonth = remainingDays < firstTwelveMonths
    ? Math.floor(remainingDays / FIXED_MONTH_LENGTH) + 1
    : 13;

  const otDay = otMonth < 13
    ? (remainingDays % FIXED_MONTH_LENGTH) + 1
    : (remainingDays - firstTwelveMonths) + 1;

  return {
    otYear,
    otMonth,
    otDay,
    otMonthName: OT_MONTH_NAMES[otMonth - 1],
    gregorianDate: localParts.gregorianDate,
    timezone,
  };
};

export const otToGregorian = (otYear, otMonth, otDay, timezone = 'UTC') => {
  assertValidTimezone(timezone);

  if (!Number.isInteger(otYear) || otYear < 0) {
    throw new Error('otYear must be a non-negative integer.');
  }

  if (!Number.isInteger(otMonth) || otMonth < 1 || otMonth > 13) {
    throw new Error('otMonth must be an integer between 1 and 13.');
  }

  const maxDay = otMonth <= 12 ? 30 : (isOTLeapYear(otYear) ? 6 : 5);

  if (!Number.isInteger(otDay) || otDay < 1 || otDay > maxDay) {
    throw new Error(`otDay must be an integer between 1 and ${maxDay} for OT month ${otMonth}.`);
  }

  const daysBeforeYear = getDaysFromEpochToOTYearStart(otYear);
  const daysBeforeMonth = otMonth <= 12 ? (otMonth - 1) * FIXED_MONTH_LENGTH : FIXED_MONTH_COUNT * FIXED_MONTH_LENGTH;

  const totalDays = daysBeforeYear + daysBeforeMonth + (otDay - 1);

  const gregorianUtcDate = new Date(OT_EPOCH_DATE.getTime() + (totalDays * MS_PER_DAY));
  const localParts = getDatePartsInTimezone(gregorianUtcDate, timezone);

  return {
    gregorianDate: localParts.gregorianDate,
    timezone,
    otYear,
    otMonth,
    otDay,
    otMonthName: OT_MONTH_NAMES[otMonth - 1],
  };
};

export const getOTDayOrder = (inputDate, timezone = 'UTC') => {
  assertValidTimezone(timezone);
  const instant = normalizeDateInput(inputDate);
  const localParts = getDatePartsInTimezone(instant, timezone);
  const dayIndex = getDayIndexFromGregorianDate(localParts.year, localParts.month, localParts.day);
  const order = OT_DAY_ORDER[dayIndex];

  return {
    index: order.index,
    ordinal: order.ordinal,
    name: order.name,
  };
};

export const buildCanonicalTimestamp = (inputDate, timezone = 'UTC') => {
  assertValidTimezone(timezone);
  const instant = normalizeDateInput(inputDate);
  const localParts = getDatePartsInTimezone(instant, timezone);
  const ot = gregorianToOT(instant, timezone);
  const dayOrder = getOTDayOrder(instant, timezone);

  return {
    timestamp_utc: instant.toISOString(),
    timestamp_local: localParts.localTimestamp,
    timezone,
    gregorian_date: localParts.gregorianDate,
    gregorian_weekday: localParts.weekday || GREGORIAN_WEEKDAYS[getDayIndexFromGregorianDate(localParts.year, localParts.month, localParts.day)],
    ot_year: ot.otYear,
    ot_month_index: ot.otMonth,
    ot_month_name: ot.otMonthName,
    ot_day: ot.otDay,
    ot_day_order_index: dayOrder.index,
    ot_day_order_ordinal: dayOrder.ordinal,
    ot_day_order_name: dayOrder.name,
  };
};
