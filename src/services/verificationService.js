import { formatDisplayTimestamp, isValidQRVID, sanitizeQRVID, truncateHash } from '../utils/qrvid.js';
import { env } from '../config/env.js';

const DEFAULT_API_BASE_URL = env.VERIFY_BASE_URL;
const REQUEST_TIMEOUT_MS = 4000;
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeStatus = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'VERIFIED':
    case 'VALID':
      return 'VERIFIED';
    case 'REVOKED':
      return 'REVOKED';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'NOT_FOUND':
      return 'NOT_FOUND';
    case 'INVALID_SIGNATURE':
      return 'INVALID_SIGNATURE';
    case 'INVALID':
      return 'NOT_FOUND';
    default:
      return 'INVALID';
  }
};

const buildViewModel = (qrvid, payload, fallbackMessage) => {
  const normalizedStatus = normalizeStatus(payload?.status);
  const message = payload?.message || fallbackMessage;

  return {
    qrvid,
    status: normalizedStatus,
    message,
    statusLabel: normalizedStatus,
    badgeClass: {
      VERIFIED: 'badge-verified',
      NOT_FOUND: 'badge-invalid',
      REVOKED: 'badge-revoked',
      EXPIRED: 'badge-expired',
      INVALID_SIGNATURE: 'badge-invalid',
    }[normalizedStatus] || 'badge-invalid',
    issuer: payload?.issuer || null,
    recordType: payload?.record_type || payload?.recordType || null,
    recipient: payload?.recipient || payload?.subject || payload?.issuedTo || null,
    certificateTitle: payload?.certificate_title || payload?.title || null,
    issuedDate: formatDisplayTimestamp(payload?.issued_at_utc || payload?.issuedDate),
    subject: payload?.subject || payload?.issuedTo || null,
    timestamp: formatDisplayTimestamp(payload?.checked_at_utc || payload?.timestamp),
    hash: truncateHash(payload?.hash || payload?.metadata_hash),
    raw: payload,
  };
};

const getApiBaseUrl = () => env.VERIFY_BASE_URL || DEFAULT_API_BASE_URL;

const fetchVerification = async (qrvid) => {
  const apiBaseUrl = getApiBaseUrl();
  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const prefixedBaseUrl = /\/api\/v1$/.test(baseUrl) ? baseUrl : `${baseUrl}/api/v1`;
  const url = `${prefixedBaseUrl}/verify/${encodeURIComponent(qrvid)}`;

  console.log(`[analytics] verification_lookup qrvid=${qrvid} url=${url}`);

  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if ((response.status === 404) || normalizeStatus(payload?.status) === 'NOT_FOUND') {
          return buildViewModel(qrvid, payload, 'Record not found');
        }

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt === 1) {
          await sleep(250);
          continue;
        }

        if (normalizeStatus(payload?.status) === 'REVOKED') {
          return buildViewModel(qrvid, payload, 'Record revoked');
        }

        if (normalizeStatus(payload?.status) === 'EXPIRED') {
          return buildViewModel(qrvid, payload, 'Record expired');
        }

        throw Object.assign(new Error('Verification service unavailable'), {
          code: 'API_UNAVAILABLE',
          statusCode: response.status,
          payload,
        });
      }

      return buildViewModel(qrvid, payload, 'Verification result available');
    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError') {
        lastError = Object.assign(new Error('Verification request timed out'), {
          code: 'TIMEOUT',
        });
      }

      if (attempt === 1) {
        await sleep(250);
        continue;
      }
    }
  }

  throw lastError;
};

export const verifyQRVID = async (incomingQRVID) => {
  const qrvid = sanitizeQRVID(incomingQRVID);

  if (!isValidQRVID(qrvid)) {
    return {
      ok: false,
      qrvid,
      error: 'Invalid identifier format',
      verification: buildViewModel(qrvid || 'Invalid identifier', { status: 'NOT_FOUND', message: 'Invalid identifier format' }, 'Invalid identifier format'),
    };
  }

  try {
    const verification = await fetchVerification(qrvid);

    return {
      ok: true,
      qrvid,
      verification,
    };
  } catch (error) {
    console.error(`Verification lookup failed for ${qrvid}:`, error);

    const message = error.code === 'TIMEOUT'
      ? 'Verification service unavailable'
      : 'Verification service unavailable';

    return {
      ok: false,
      qrvid,
      error: message,
      verification: {
        qrvid,
        status: 'UNAVAILABLE',
        message,
        statusLabel: 'SERVICE UNAVAILABLE',
        badgeClass: 'badge-unavailable',
        issuer: null,
        recordType: null,
        subject: null,
        timestamp: null,
        hash: null,
        raw: {
          status: 'UNAVAILABLE',
          message,
          code: error.code || 'API_UNAVAILABLE',
        },
      },
    };
  }
};
