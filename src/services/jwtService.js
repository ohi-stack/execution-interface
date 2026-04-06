import crypto from 'node:crypto';

const TOKEN_ISSUER = process.env.JWT_ISSUER || 'qrv-identity-service';
const TOKEN_AUDIENCE = process.env.JWT_AUDIENCE || 'qrv-api';
const TOKEN_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS || 3600);
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret-change-me';

const base64UrlEncode = (value) => Buffer.from(value).toString('base64url');
const base64UrlDecode = (value) => Buffer.from(value, 'base64url').toString('utf8');

const signSegment = (input) => crypto
  .createHmac('sha256', JWT_SECRET)
  .update(input)
  .digest('base64url');

export const issueToken = ({ sub, role, claims = {} }) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: TOKEN_ISSUER,
    aud: TOKEN_AUDIENCE,
    iat: now,
    nbf: now,
    exp: now + TOKEN_TTL_SECONDS,
    sub,
    role,
    ...claims,
  };

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signSegment(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    return {
      ok: false,
      code: 'TOKEN_MISSING',
      message: 'Token is required.',
    };
  }

  const segments = token.split('.');
  if (segments.length !== 3) {
    return {
      ok: false,
      code: 'TOKEN_INVALID',
      message: 'Token format is invalid.',
    };
  }

  const [encodedHeader, encodedPayload, signature] = segments;
  const expectedSignature = signSegment(`${encodedHeader}.${encodedPayload}`);

  if (signature.length !== expectedSignature.length) {
    return {
      ok: false,
      code: 'TOKEN_INVALID_SIGNATURE',
      message: 'Token signature is invalid.',
    };
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return {
      ok: false,
      code: 'TOKEN_INVALID_SIGNATURE',
      message: 'Token signature is invalid.',
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      return {
        ok: false,
        code: 'TOKEN_INVALID',
        message: 'Token header is invalid.',
      };
    }

    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== TOKEN_ISSUER || payload.aud !== TOKEN_AUDIENCE) {
      return {
        ok: false,
        code: 'TOKEN_INVALID',
        message: 'Token issuer or audience is invalid.',
      };
    }

    if (typeof payload.nbf === 'number' && payload.nbf > now) {
      return {
        ok: false,
        code: 'TOKEN_NOT_ACTIVE',
        message: 'Token is not active yet.',
      };
    }

    if (typeof payload.exp !== 'number' || payload.exp <= now) {
      return {
        ok: false,
        code: 'TOKEN_EXPIRED',
        message: 'Token is expired.',
      };
    }

    return {
      ok: true,
      payload,
    };
  } catch {
    return {
      ok: false,
      code: 'TOKEN_INVALID',
      message: 'Token payload is invalid.',
    };
  }
};
