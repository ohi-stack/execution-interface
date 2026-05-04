const OMOS_REST_BASE_URL = process.env.OMOS_REST_BASE_URL;
const OMOS_API_BASE_URL = process.env.OMOS_API_BASE_URL;
const OMOS_APP_BRIDGE_KEY = process.env.OMOS_APP_BRIDGE_KEY;
const OMOS_MODULE_SLUG = process.env.OMOS_MODULE_SLUG ?? 'omos-plugin-bridge';

export type OmosChatPayload = {
  message: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
};

export function getOmosBridgeConfig() {
  return {
    restBaseUrl: OMOS_REST_BASE_URL,
    apiBaseUrl: OMOS_API_BASE_URL,
    moduleSlug: OMOS_MODULE_SLUG,
    hasBridgeKey: Boolean(OMOS_APP_BRIDGE_KEY)
  };
}

export async function sendOmosChat(payload: OmosChatPayload) {
  if (!OMOS_API_BASE_URL || !OMOS_APP_BRIDGE_KEY) {
    throw new Error('OMOS bridge is not configured. Missing OMOS_API_BASE_URL or OMOS_APP_BRIDGE_KEY.');
  }

  const res = await fetch(`${OMOS_API_BASE_URL.replace(/\/$/, '')}/llm/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OMOS-App-Key': OMOS_APP_BRIDGE_KEY,
      'X-OMOS-Module-Slug': OMOS_MODULE_SLUG
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OMOS bridge request failed (${res.status}): ${text || 'Unknown error'}`);
  }

  return res.json();
}
