import test from 'node:test';
import assert from 'node:assert/strict';
import {
  daysInOTYear,
  getOTDayOrder,
  gregorianToOT,
  isOTLeapYear,
  otToGregorian,
} from '../src/services/timeConversionService.js';

test('2025-03-18 maps to Genesis 01, 0000 OT', () => {
  const result = gregorianToOT('2025-03-18T00:00:00.000Z');

  assert.equal(result.otYear, 0);
  assert.equal(result.otMonth, 1);
  assert.equal(result.otDay, 1);
  assert.equal(result.otMonthName, 'Genesis');
});

test('2026-03-17 maps to final day of OT 0000', () => {
  const result = gregorianToOT('2026-03-17T12:00:00.000Z');

  assert.equal(result.otYear, 0);
  assert.equal(result.otMonth, 13);
  assert.equal(result.otDay, 5);
  assert.equal(result.otMonthName, 'Ascension');
});

test('2026-03-18 maps to Genesis 01, 0001 OT', () => {
  const result = gregorianToOT('2026-03-18T00:00:00.000Z');

  assert.equal(result.otYear, 1);
  assert.equal(result.otMonth, 1);
  assert.equal(result.otDay, 1);
  assert.equal(result.otMonthName, 'Genesis');
});

test('2026-03-26 maps to Genesis 09, 0001 OT and The Fifth Day™ — Onyá·ta', () => {
  const result = gregorianToOT('2026-03-26T00:00:00.000Z');
  const dayOrder = getOTDayOrder('2026-03-26T00:00:00.000Z');

  assert.equal(result.otYear, 1);
  assert.equal(result.otMonth, 1);
  assert.equal(result.otDay, 9);
  assert.equal(dayOrder.index, 5);
  assert.equal(dayOrder.ordinal, 'The Fifth Day™');
  assert.equal(dayOrder.name, 'Onyá·ta');
});

test('OT 0002 leap behavior uses Gregorian end-year 2028', () => {
  assert.equal(isOTLeapYear(2), true);
  assert.equal(daysInOTYear(2), 366);

  const finalDay = otToGregorian(2, 13, 6);
  assert.equal(finalDay.gregorianDate, '2028-03-17');

  assert.throws(() => otToGregorian(2, 13, 7), /otDay must be an integer between 1 and 6/);
});
