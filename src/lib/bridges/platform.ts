export type BridgeStatus = 'configured' | 'missing-wordpress-url' | 'missing-app-key';

export type WordpressBridgeConfig = {
  wordpressApiUrl: string | null;
  appKey: string | null;
  hasWordpressApiUrl: boolean;
  hasAppKey: boolean;
  status: BridgeStatus;
};

export type WordpressRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, '');
}

export function getWordpressBridgeConfig(): WordpressBridgeConfig {
  const wordpressApiUrl = process.env.WORDPRESS_API_URL?.trim() || null;
  const appKey = process.env.OMOS_APP_KEY?.trim() || process.env.OMOS_APP_BRIDGE_KEY?.trim() || process.env.API_KEY?.trim() || null;

  return {
    wordpressApiUrl,
    appKey,
    hasWordpressApiUrl: Boolean(wordpressApiUrl),
    hasAppKey: Boolean(appKey),
    status: !wordpressApiUrl ? 'missing-wordpress-url' : !appKey ? 'missing-app-key' : 'configured'
  };
}

export function getBridgeHeaders(appKey = getWordpressBridgeConfig().appKey): HeadersInit {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(appKey ? { 'X-OMOS-App-Key': appKey } : {})
  };
}

export function buildWordpressUrl(path: string, searchParams: WordpressRequestOptions['searchParams'] = {}) {
  const config = getWordpressBridgeConfig();

  if (!config.wordpressApiUrl) {
    throw new Error('WORDPRESS_API_URL is required for the WordPress bridge.');
  }

  const url = new URL(`${trimTrailingSlash(config.wordpressApiUrl)}/${trimLeadingSlash(path)}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  return url;
}

export async function wordpressRequest<T>(options: WordpressRequestOptions): Promise<T> {
  const config = getWordpressBridgeConfig();

  if (!config.appKey) {
    throw new Error('OMOS_APP_KEY is required for the WordPress bridge.');
  }

  const response = await fetch(buildWordpressUrl(options.path, options.searchParams), {
    method: options.method ?? 'GET',
    headers: getBridgeHeaders(config.appKey),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    next: options.revalidate === undefined ? undefined : { revalidate: options.revalidate }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`WordPress bridge request failed (${response.status}): ${message || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getPlatformBridgeStatus() {
  const config = getWordpressBridgeConfig();

  return {
    id: 'platform',
    status: config.status,
    wordpressApiUrl: config.wordpressApiUrl,
    supports: ['X-OMOS-App-Key', 'OMOS_APP_KEY', 'WORDPRESS_API_URL'],
    endpoints: ['wp-json/omos/v1/manifest', 'wp-json/omos/v1/tools', 'wp-json/omos/v1/stats']
  };
}
