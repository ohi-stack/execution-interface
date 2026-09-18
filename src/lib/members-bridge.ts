export type MembersBridgeResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
};

const DEFAULT_BASE = 'https://onegodian.org/wp-json/onegodian-members/v1';

export function getMembersBaseUrl() {
  return (process.env.ONEGODIAN_MEMBERS_REST_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
}

export function getMembersBridgeConfigured() {
  return Boolean(process.env.ONEGODIAN_MEMBERS_BRIDGE_KEY);
}

async function requestMembers<T>(path: string, options: RequestInit = {}): Promise<MembersBridgeResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    const key = process.env.ONEGODIAN_MEMBERS_BRIDGE_KEY;
    if (key) headers.set('X-OneGodian-Members-Key', key);

    const response = await fetch(`${getMembersBaseUrl()}${path}`, {
      ...options,
      headers,
      cache: 'no-store',
      signal: controller.signal
    });

    let payload: T | null = null;
    try {
      payload = (await response.json()) as T;
    } catch {
      payload = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: payload,
      error: response.ok ? undefined : `Members bridge returned HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Members bridge request failed'
    };
  } finally {
    clearTimeout(timeout);
  }
}

export type MembersHealth = {
  status: string;
  service: string;
  version: string;
  wordpress?: string;
  woocommerce?: boolean;
  buddypress?: boolean;
  auto_page_sync?: boolean;
  timestamp_utc?: string;
};

export type MembersManifest = {
  id: string;
  name: string;
  version: string;
  status: string;
  features?: string[];
  shortcodes?: string[];
  legacy_shortcodes?: string[];
  pages?: Record<string, { title: string; slug: string; shortcode: string; page_id: number; url: string; status: string }>;
  integrations?: Record<string, unknown>;
  endpoints?: string[];
};

export type MembersSyncStatus = {
  status: string;
  version: string;
  manifest_hash: string;
  pages?: MembersManifest['pages'];
  timestamp_utc?: string;
};

export async function getMembersHealth() {
  return requestMembers<MembersHealth>('/health');
}

export async function getMembersManifest() {
  return requestMembers<MembersManifest>('/manifest');
}

export async function getMembersSyncStatus() {
  return requestMembers<MembersSyncStatus>('/sync/status');
}

export async function getMembersBridgeSnapshot() {
  const [health, manifest, sync] = await Promise.all([
    getMembersHealth(),
    getMembersManifest(),
    getMembersBridgeConfigured()
      ? getMembersSyncStatus()
      : Promise.resolve<MembersBridgeResult<MembersSyncStatus>>({ ok: false, status: 0, data: null, error: 'Bridge key not configured' })
  ]);

  return {
    baseUrl: getMembersBaseUrl(),
    bridgeConfigured: getMembersBridgeConfigured(),
    health,
    manifest,
    sync
  };
}
