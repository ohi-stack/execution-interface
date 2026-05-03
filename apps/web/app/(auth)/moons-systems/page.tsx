import { odinPlanets } from '../../../lib/odin-data';

export default function MoonsSystemsPage() {
  return (
    <main>
      <h1 className="text-2xl">Moons & Systems</h1>
      <p className="mb-4">Static fallback data for ODIN-PR planetary records.</p>
      <ul className="space-y-2">
        {odinPlanets.map((planet) => (
          <li key={planet.code} className="rounded border p-3">
            <strong>{planet.code}</strong> — {planet.name} · {planet.system} · {planet.moons} moons
          </li>
        ))}
      </ul>
    </main>
  );
}
