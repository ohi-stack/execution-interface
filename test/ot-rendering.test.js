import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderFormalInstitutionalTimestamp,
  renderLegalFirstDualDate,
  renderPublicDisplayTimestamp,
} from '../src/utils/otRenderHelpers.js';
import { OT_ASSISTANT_RESPONSE_TEMPLATE, OT_POLICY_PRIMER_TEMPLATE } from '../src/prompts/otPolicyTemplates.js';
import { __internal as clientInternal } from '../src/services/onegodianApiClient.js';
import { buildOtPresentationModel } from '../src/services/onegodianTimeService.js';
import { verifyQRVID } from '../src/services/verificationService.js';

const knownCanonicalDate = {
  gregorian_utc_iso: '2026-01-15T00:00:00Z',
  ot_iso: 'OT-3026-04-10T00:00:00Z',
  ot_day_order: 'DO-05',
  ot_weekday: 'Thursday',
  ot_month: 'Aster',
  ot_day: 10,
  ot_year: 3026,
  source_authority: 'onegodian-api/v1',
};

test('formal institutional renderer is deterministic and legal-first', () => {
  assert.equal(
    renderFormalInstitutionalTimestamp(knownCanonicalDate),
    'Gregorian (Legal): 2026-01-15T00:00:00Z | Onegodian Time (Supplemental): OT-3026-04-10T00:00:00Z | Day Order: DO-05 (Sunday-start fixed)',
  );
});

test('public display renderer is deterministic and supplemental-aware', () => {
  assert.equal(
    renderPublicDisplayTimestamp(knownCanonicalDate),
    'Thursday, Aster 10, 3026 OT (supplemental) · 2026-01-15T00:00:00Z Gregorian (legal)',
  );
});

test('legal-first dual-date renderer is deterministic', () => {
  assert.equal(
    renderLegalFirstDualDate(knownCanonicalDate),
    '2026-01-15T00:00:00Z [Gregorian — legal controlling date] / OT-3026-04-10T00:00:00Z [OT — supplemental governance date]',
  );
});

test('policy templates encode Gregorian legal control and OT supplemental role', () => {
  assert.match(OT_POLICY_PRIMER_TEMPLATE, /Gregorian dates and timestamps are the legal controlling record/i);
  assert.match(OT_POLICY_PRIMER_TEMPLATE, /Onegodian Time \(OT\) is supplemental/i);
  assert.match(OT_POLICY_PRIMER_TEMPLATE, /Day Order is fixed to Sunday-start/i);

  assert.match(OT_ASSISTANT_RESPONSE_TEMPLATE, /Gregorian legal date first/i);
  assert.match(OT_ASSISTANT_RESPONSE_TEMPLATE, /Day Order is Sunday-start fixed/i);
});

test('canonical payload validation rejects non-authoritative source labels', () => {
  assert.throws(
    () => clientInternal.assertCanonicalPayload({ ...knownCanonicalDate, source_authority: 'local-engine' }),
    /non-authoritative source/,
  );
});

test('OT service returns deterministic fallback when authority unavailable and fallback enabled', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error('network down');
  };

  try {
    const result = await buildOtPresentationModel('2026-01-15T00:00:00Z', { allowValidatedFallback: true });
    assert.equal(result.authority, 'onegodian-api-unavailable');
    assert.match(result.rendered.legalFirstDualDate, /Gregorian — legal controlling date/);
    assert.match(result.warning || '', /OT withheld pending onegodian-api recovery/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('verification view model uses authoritative OT render output instead of local date conversion logic', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    if (String(url).includes('/verify/')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          status: 'VERIFIED',
          issuer: 'issuer-qrv',
          subject: 'subject-1',
          timestamp_utc: '2026-01-15T00:00:00Z',
          hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        }),
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => knownCanonicalDate,
    };
  };

  try {
    const result = await verifyQRVID('QRV-ENFORCE-1001');
    assert.equal(result.ok, true);
    assert.equal(
      result.verification.timestamp,
      '2026-01-15T00:00:00Z [Gregorian — legal controlling date] / OT-3026-04-10T00:00:00Z [OT — supplemental governance date]',
    );
    assert.equal(result.verification.temporal.authority, 'onegodian-api/v1');
  } finally {
    global.fetch = originalFetch;
  }
});
