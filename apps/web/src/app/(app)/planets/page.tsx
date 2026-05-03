import { ODIN_PR_PLANETS } from '@/lib/planets';

export default function PlanetsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Planetary Registry</h1>
        <p className="mt-2 text-slate-300">25 ODIN-PR planets initialized.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ODIN_PR_PLANETS.map((planet) => (
            <div key={planet.code} className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs text-neon">{planet.code}</p>
              <p className="font-medium">{planet.name}</p>
              <p className="text-sm text-slate-400">Status: {planet.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
