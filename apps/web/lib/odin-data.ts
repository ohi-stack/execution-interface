export const odinPlanets = Array.from({ length: 25 }, (_, i) => ({
  code: `ODIN-PR-${String(i + 1).padStart(2, '0')}`,
  name: `Planet ${i + 1}`,
  moons: (i % 4) + 1,
  system: `System ${String.fromCharCode(65 + (i % 5))}`,
}));
