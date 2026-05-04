import { ENV } from '@/config/env';

const DAY_MS = 24 * 60 * 60 * 1000;
const epochUtcMs = Date.parse(`${ENV.OT_EPOCH}T00:00:00.000Z`);

export function getOTDate(date = new Date()) {
  const utcDateOnly = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diff = Math.floor((utcDateOnly - epochUtcMs) / DAY_MS);

  let year = 0;
  let days = diff;

  while (days >= 365) {
    days -= 365;
    year += 1;
  }

  const month = Math.floor(days / 30) + 1;
  const day = (days % 30) + 1;

  return {
    ot_year: year,
    ot_month: month,
    ot_day: day
  };
}
