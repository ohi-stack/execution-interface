const safe = (value) => (value == null ? '' : String(value));

/**
 * @typedef {Object} CanonicalOtRenderModel
 * @property {string} gregorian_utc_iso
 * @property {string} ot_iso
 * @property {string} ot_day_order
 * @property {string} ot_weekday
 * @property {string} ot_month
 * @property {number} ot_day
 * @property {number} ot_year
 */

/**
 * Formal institutional timestamp for governance artifacts.
 * Gregorian appears first for legal primacy; OT is explicit supplemental data.
 *
 * @param {CanonicalOtRenderModel} canonical
 */
export const renderFormalInstitutionalTimestamp = (canonical) =>
  `Gregorian (Legal): ${safe(canonical.gregorian_utc_iso)} | Onegodian Time (Supplemental): ${safe(canonical.ot_iso)} | Day Order: ${safe(canonical.ot_day_order)} (Sunday-start fixed)`;

/**
 * Public-facing timestamp format optimized for readability.
 *
 * @param {CanonicalOtRenderModel} canonical
 */
export const renderPublicDisplayTimestamp = (canonical) =>
  `${safe(canonical.ot_weekday)}, ${safe(canonical.ot_month)} ${safe(canonical.ot_day)}, ${safe(canonical.ot_year)} OT (supplemental) · ${safe(canonical.gregorian_utc_iso)} Gregorian (legal)`;

/**
 * Legal-first dual-date format for policies, notices, and records.
 *
 * @param {CanonicalOtRenderModel} canonical
 */
export const renderLegalFirstDualDate = (canonical) =>
  `${safe(canonical.gregorian_utc_iso)} [Gregorian — legal controlling date] / ${safe(canonical.ot_iso)} [OT — supplemental governance date]`;
