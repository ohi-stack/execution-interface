import { fetchCanonicalOtTimestamp } from './onegodianApiClient.js';
import {
  renderFormalInstitutionalTimestamp,
  renderLegalFirstDualDate,
  renderPublicDisplayTimestamp,
} from '../utils/otRenderHelpers.js';

const toFallbackRecord = (gregorianUtcIso) => ({
  gregorian_utc_iso: gregorianUtcIso,
  ot_iso: 'UNAVAILABLE',
  ot_day_order: 'UNAVAILABLE',
  ot_weekday: 'UNAVAILABLE',
  ot_month: 'UNAVAILABLE',
  ot_day: 0,
  ot_year: 0,
  source_authority: 'onegodian-api-unavailable',
});

/**
 * Orchestrates canonical OT retrieval from onegodian-api and standardized rendering.
 *
 * This service intentionally does not perform independent OT computation.
 */
export const buildOtPresentationModel = async (gregorianUtcIso, options = {}) => {
  const allowValidatedFallback = options.allowValidatedFallback === true;

  try {
    const canonical = await fetchCanonicalOtTimestamp(gregorianUtcIso);

    return {
      authority: canonical.source_authority,
      canonical,
      rendered: {
        formalInstitutionalTimestamp: renderFormalInstitutionalTimestamp(canonical),
        publicDisplayTimestamp: renderPublicDisplayTimestamp(canonical),
        legalFirstDualDate: renderLegalFirstDualDate(canonical),
      },
      warning: null,
    };
  } catch (error) {
    if (!allowValidatedFallback) {
      throw error;
    }

    const fallback = toFallbackRecord(gregorianUtcIso);

    return {
      authority: fallback.source_authority,
      canonical: fallback,
      rendered: {
        formalInstitutionalTimestamp: renderFormalInstitutionalTimestamp(fallback),
        publicDisplayTimestamp: renderPublicDisplayTimestamp(fallback),
        legalFirstDualDate: renderLegalFirstDualDate(fallback),
      },
      warning: 'Authoritative OT values unavailable. Gregorian legal timestamp retained; OT withheld pending onegodian-api recovery.',
    };
  }
};
