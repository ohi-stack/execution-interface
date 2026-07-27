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

export type OmosProvider = {
  slug: string;
  name: string;
  type: string;
  configured: boolean;
  hasApiKey?: boolean;
  baseUrl?: string;
  model?: string;
};

export type OmosLlmGateway = {
  enabled?: boolean;
  defaultProvider?: string;
  configuredProviders?: number;
  providers?: OmosProvider[];
  endpoints?: string[];
};

export type OmosManifest = {
  name?: string;
  slug?: string;
  version?: string;
  app_url?: string;
  dashboard_url?: string;
  endpoints?: Record<string, string> | string[];
  restEndpoints?: string[];
  tools?: unknown[];
  llmGateway?: OmosLlmGateway;
  llm_providers?: string[];
  [key: string]: unknown;
};

export type OmosSubmissionStats = {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  declaration?: number;
  seal?: number;
  mapper?: number;
  [key: string]: unknown;
};

export type OmosTool = {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  endpoint?: string;
  shortcode?: string;
  status?: string;
  provider?: string;
  [key: string]: unknown;
};

export type OmosProvidersResponse = {
  items?: OmosProvider[];
};

export type OmosUsage = {
  totalRequestsLogged?: number;
  byProvider?: Record<string, number>;
  lastRequest?: Record<string, unknown> | null;
};

const DEFAULT_BASE_URL = 'https://onegodian.org/wp-json/omos/v1';

export function getOmosBaseUrl() {
  return (process.env.OMOS_API_BASE_URL || process.env.OMOS_REST_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
}

export function getOmosEnvironmentSummary() {
  return {
    apiBaseUrl: getOmosBaseUrl(),
    hasBridgeKey: Boolean(process.env.OMOS_APP_BRIDGE_KEY),
    appDashboardUrl: process.env.OMOS_APP_DASHBOARD_URL || 'https://app.onegodian.com/omos',
    moduleSlug: process.env.OMOS_MODULE_SLUG || 'omos'
  };
}

export async function fetchOmosEndpoint<T>(path: string, init: RequestInit = {}): Promise<OmosBridgeResponse<T>> {
  const baseUrl = getOmosBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: 'application/json'
  };

  const incomingHeaders = new Headers(init.headers);
  incomingHeaders.forEach((value, key) => {
    headers[key] = value;
  });

  if (process.env.OMOS_APP_BRIDGE_KEY) {
    headers['X-OMOS-App-Key'] = process.env.OMOS_APP_BRIDGE_KEY;
  }

  try {
    const response = await fetch(url, {
      ...init,
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

export async function postOmosEndpoint<T>(path: string, body: unknown): Promise<OmosBridgeResponse<T>> {
  return fetchOmosEndpoint<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

function normalizeTools(data: OmosTool[] | { items?: OmosTool[] } | null) {
  if (Array.isArray(data)) return data;
  return data?.items || [];
}

export async function getOmosDashboardData() {
  const [status, manifest, tools, stats, providers, usage] = await Promise.all([
    fetchOmosEndpoint<OmosStatus>('/status'),
    fetchOmosEndpoint<OmosManifest>('/app-manifest'),
    fetchOmosEndpoint<OmosTool[] | { items?: OmosTool[] }>('/tools'),
    fetchOmosEndpoint<OmosSubmissionStats>('/submissions/stats'),
    fetchOmosEndpoint<OmosProvidersResponse>('/llm/providers'),
    fetchOmosEndpoint<OmosUsage>('/llm/usage')
  ]);

  return {
    environment: getOmosEnvironmentSummary(),
    status,
    manifest,
    tools: { ...tools, data: normalizeTools(tools.data) },
    stats,
    providers,
    usage
  };
}
