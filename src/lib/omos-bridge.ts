export type OmosBridgeResponse<T> = {
  ok: boolean;
  data: T | null;
  error?: string;
};

export type OmosStatus = {
  status?: string;
  plugin?: string;
  version?: string;
  site_url?: string;
  app_url?: string;
  module_slug?: string;
  timestamp?: string;
  [key: string]: unknown;
};

export type OmosManifest = {
  name?: string;
  slug?: string;
  version?: string;
  app_url?: string;
  dashboard_url?: string;
  endpoints?: Record<string, string> | string[];
  tools?: unknown[];
  llm_providers?: string[];
  [key: string]: unknown;
};

export type OmosSubmissionStats = {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  [key: string]: unknown;
};

export type OmosTool = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  endpoint?: string;
  status?: string;
  provider?: string;
  [key: string]: unknown;
};

const DEFAULT_BASE_URL = 'https://onegodian.org/wp-json/omos/v1';

export function getOmosBaseUrl() {
  return (process.env.OMOS_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
}

export function getOmosEnvironmentSummary() {
  return {
    apiBaseUrl: getOmosBaseUrl(),
    hasBridgeKey: Boolean(process.env.OMOS_APP_BRIDGE_KEY),
    appDashboardUrl: process.env.OMOS_APP_DASHBOARD_URL || 'https://app.onegodian.com/omos',
    moduleSlug: process.env.OMOS_MODULE_SLUG || 'omos'
  };
}

export async function fetchOmosEndpoint<T>(path: string): Promise<OmosBridgeResponse<T>> {
  const baseUrl = getOmosBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: HeadersInit = {
    Accept: 'application/json'
  };

  if (process.env.OMOS_APP_BRIDGE_KEY) {
    headers['X-OMOS-App-Key'] = process.env.OMOS_APP_BRIDGE_KEY;
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        error: `OMOS bridge returned ${response.status}`
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown OMOS bridge error'
    };
  }
}

export async function getOmosDashboardData() {
  const [status, manifest, tools, stats] = await Promise.all([
    fetchOmosEndpoint<OmosStatus>('/status'),
    fetchOmosEndpoint<OmosManifest>('/app-manifest'),
    fetchOmosEndpoint<OmosTool[]>('/tools'),
    fetchOmosEndpoint<OmosSubmissionStats>('/submissions/stats')
  ]);

  return {
    environment: getOmosEnvironmentSummary(),
    status,
    manifest,
    tools,
    stats
  };
}
