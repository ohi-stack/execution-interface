const express = require('express');
const { listEvents } = require('../storage/scheduler-store');

const DAY_NAMES = ['Skénra', 'Teyó·ra', 'Ahsténha', 'Yawénni', 'Onyá·ta', 'Shakó·wa', 'Niyóhsera'];
const OT_MONTHS = ['Genesis','Wisdom','Planting','Justice','Freedom','Prosperity','Innovation','Transformation','Remembrance','Covenant','Invention','Independence','Ascension'];
const DAY_MS = 24 * 60 * 60 * 1000;
const OT_EPOCH = process.env.OT_EPOCH || '2025-03-18';
const OT_EPOCH_UTC_MS = Date.parse(`${OT_EPOCH}T00:00:00.000Z`);
const ENV = { OT_STANDARD: process.env.OT_STANDARD || 'OTS-V5', OT_EPOCH, OT_WEEK_START: process.env.OT_WEEK_START || 'SKENRA_SUNDAY', OT_DEFAULT_TIMEZONE: process.env.OT_DEFAULT_TIMEZONE || 'America/New_York', API_BASE_URL: process.env.API_BASE_URL || '', PUBLIC_APP_URL: process.env.PUBLIC_APP_URL || '', ENABLE_CALENDAR: process.env.ENABLE_CALENDAR !== 'false', ENABLE_SCHEDULER: process.env.ENABLE_SCHEDULER !== 'false' };

function isGregorianLeapYear(year) { return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0; }
function isOTLeapYear(otYear) { return isGregorianLeapYear(2025 + otYear + 1); }
function toUTCDateOnly(value) { return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()); }
function toOnegodianDate(input) { const utcDateOnly = toUTCDateOnly(input); const deltaDays = Math.floor((utcDateOnly - OT_EPOCH_UTC_MS) / DAY_MS); if (deltaDays < 0) throw new Error('Gregorian date must be on or after OT_EPOCH.'); let remainingDays = deltaDays; let otYear = 0; while (remainingDays >= (isOTLeapYear(otYear) ? 366 : 365)) { remainingDays -= isOTLeapYear(otYear) ? 366 : 365; otYear += 1; } const monthLengths = new Array(12).fill(30); monthLengths.push(isOTLeapYear(otYear) ? 6 : 5); let monthIndex = 0; while (remainingDays >= monthLengths[monthIndex]) { remainingDays -= monthLengths[monthIndex]; monthIndex += 1; } return { year: otYear, monthIndex: monthIndex + 1, monthName: OT_MONTHS[monthIndex], day: remainingDays + 1 }; }
function formatOnegodianDate(date) { const ot = toOnegodianDate(date); return `${ot.monthName} ${String(ot.day).padStart(2, '0')}, ${String(ot.year).padStart(4, '0')} OT`; }
function getDayOrder(date) { const dayIndex = date.getUTCDay(); return { index: dayIndex, name: DAY_NAMES[dayIndex] }; }

const router = express.Router();
router.get('/config', (_req, res) => res.json({ ok: true, standard: ENV.OT_STANDARD, epoch: ENV.OT_EPOCH, weekStart: ENV.OT_WEEK_START, defaultTimezone: ENV.OT_DEFAULT_TIMEZONE, apiBaseUrl: ENV.API_BASE_URL, publicAppUrl: ENV.PUBLIC_APP_URL, features: { calendar: ENV.ENABLE_CALENDAR, scheduler: ENV.ENABLE_SCHEDULER } }));
router.get('/now', (_req, res) => { const now = new Date(); const ot = toOnegodianDate(now); const day = getDayOrder(now); res.json({ standard: ENV.OT_STANDARD, timestampUtc: now.toISOString(), gregorianDate: now.toISOString().split('T')[0], ot: { ...ot, display: formatOnegodianDate(now) }, dayOrder: day }); });
router.get('/convert', (req, res) => { const { date } = req.query; if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'invalid_date_format' }); const d = new Date(`${date}T00:00:00Z`); try { const ot = toOnegodianDate(d); const day = getDayOrder(d); return res.json({ standard: ENV.OT_STANDARD, timestampUtc: d.toISOString(), gregorianDate: date, ot: { ...ot, display: formatOnegodianDate(d) }, dayOrder: day }); } catch (error) { return res.status(400).json({ error: 'date_out_of_range', message: error.message }); } });
router.get('/month', (req, res) => { const year = Number(req.query.year); const month = Number(req.query.month); if (!year || !month || month < 1 || month > 12) return res.status(400).json({ error: 'invalid_month_request' }); const events = listEvents(); const days = []; const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate(); for (let day = 1; day <= lastDay; day += 1) { const d = new Date(Date.UTC(year, month - 1, day)); const dayString = d.toISOString().slice(0, 10); const eventCount = events.filter((e) => e.timestamp_utc.startsWith(dayString)).length; days.push({ gregorianDate: dayString, ot: { ...toOnegodianDate(d), display: formatOnegodianDate(d) }, dayOrder: getDayOrder(d), events: { count: eventCount } }); } res.json({ standard: ENV.OT_STANDARD, year, month, weekStart: 'Sunday', days }); });

module.exports = router;
module.exports.ENV = ENV;
module.exports.toOnegodianDate = toOnegodianDate;
module.exports.formatOnegodianDate = formatOnegodianDate;
module.exports.getDayOrder = getDayOrder;
