const OMOS_BASE_URL = 'https://omos.onegodian.com';

export type OmosSyncState = {
  lastSyncUtc: string | null;
  manifest: Record<string, unknown> | null;
  health: Record<string, unknown> | null;
  pages: unknown[];
  errors: string[];
};

const state: OmosSyncState = {
  lastSyncUtc: null,
  manifest: null,
  health: null,
  pages: [],
  errors: []
};

async function fetchJson(path: string) {
  const response = await fetch(`${OMOS_BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path} failed (${response.status})`);
  return response.json();
}

export async function syncOmos() {
  const errors: string[] = [];
  const [manifestResult, healthResult, pagesResult] = await Promise.allSettled([
    fetchJson('/api/manifest'),
    fetchJson('/api/health'),
    fetchJson('/api/pages')
  ]);

  if (manifestResult.status === 'fulfilled') state.manifest = manifestResult.value;
  else errors.push(`manifest: ${manifestResult.reason instanceof Error ? manifestResult.reason.message : 'unknown error'}`);

  if (healthResult.status === 'fulfilled') state.health = healthResult.value;
  else errors.push(`health: ${healthResult.reason instanceof Error ? healthResult.reason.message : 'unknown error'}`);

  if (pagesResult.status === 'fulfilled') state.pages = Array.isArray(pagesResult.value?.pages) ? pagesResult.value.pages : [];
  else errors.push(`pages: ${pagesResult.reason instanceof Error ? pagesResult.reason.message : 'unknown error'}`);

  state.errors = errors;
  state.lastSyncUtc = new Date().toISOString();

  return getOmosSyncState();
}

export function getOmosSyncState(): OmosSyncState {
  return { ...state, pages: [...state.pages], errors: [...state.errors] };
}
