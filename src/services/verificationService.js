import { formatDisplayTimestamp, isValidQRVID, sanitizeQRVID, truncateHash } from '../utils/qrvid.js';

const DEFAULT_API_BASE_URL = 'https://api.qrv.network/api/v1';
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
    case 'VERIFIED': return 'VERIFIED';
    case 'REVOKED': return 'REVOKED';
    case 'EXPIRED': return 'EXPIRED';
    case 'NOT_FOUND':
    default:
      return 'NOT_FOUND';
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
    }[normalizedStatus] || 'badge-invalid',
    issuer: payload?.issuer || null,
    issuerLogoUrl: payload?.issuer_logo_url || null,
    certificateTitle: payload?.certificate_title || payload?.recordType || null,
    recipient: payload?.subject || payload?.issuedTo || null,
    issueDate: formatDisplayTimestamp(payload?.issued_at_utc),
    timestamp: formatDisplayTimestamp(payload?.checked_at_utc || payload?.timestamp),
    proofReference: payload?.proof_reference || payload?.signature || null,
    hash: truncateHash(payload?.metadata_hash || payload?.hash),
    raw: payload,
  };
};

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || DEFAULT_API_BASE_URL;

const fetchVerification = async (qrvid) => {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl.replace(/\/$/, '')}/verify/${encodeURIComponent(qrvid)}`;

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

        throw Object.assign(new Error('Verification service unavailable'), { code: 'API_UNAVAILABLE', statusCode: response.status, payload });
      }

      return buildViewModel(qrvid, payload, 'Verification result available');
    } catch (error) {
      lastError = error.name === 'AbortError' ? Object.assign(new Error('Verification request timed out'), { code: 'TIMEOUT' }) : error;
      if (attempt === 1) await sleep(250);
    }
  }

  throw lastError;
};

export const verifyQRVID = async (incomingQRVID) => {
  const qrvid = sanitizeQRVID(incomingQRVID);

  if (!isValidQRVID(qrvid)) {
    return { ok: false, qrvid, error: 'Invalid identifier format', verification: buildViewModel(qrvid || 'Invalid identifier', { status: 'NOT_FOUND', message: 'Invalid identifier format' }, 'Invalid identifier format') };
  }

  try {
    const verification = await fetchVerification(qrvid);
    return { ok: true, qrvid, verification };
  } catch (_error) {
    return { ok: false, qrvid, error: 'Verification service unavailable', verification: buildViewModel(qrvid, { status: 'NOT_FOUND', message: 'Verification service unavailable' }, 'Verification service unavailable') };
  }
};
