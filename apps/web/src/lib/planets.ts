export type OdinPlanet = { code: string; name: string; status: 'draft' | 'active' | 'queued' };

export const ODIN_PR_PLANETS: OdinPlanet[] = Array.from({ length: 25 }, (_, i) => ({
  code: `ODIN-PR-${String(i + 1).padStart(2, '0')}`,
  name: `Planet ${i + 1}`,
  status: i < 5 ? 'active' : i < 15 ? 'queued' : 'draft'
}));
