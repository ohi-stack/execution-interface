const FALLBACK_SITE_URL = 'https://issuer.qrv.network';

const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return FALLBACK_SITE_URL;
  }

  try {
    const parsed = new URL(trimmed);
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return FALLBACK_SITE_URL;
  }
};

export const getSiteUrl = () => normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
