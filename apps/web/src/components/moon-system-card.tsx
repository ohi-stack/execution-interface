import { MoonSystem } from '@/lib/moons-systems';

const categoryLabel: Record<MoonSystem['moons'][number]['category'], string> = {
  'habitable-candidate': 'Habitable Candidate',
  resource: 'Resource',
  observatory: 'Observatory',
  frontier: 'Frontier'
};

export function MoonSystemCard({ system }: { system: MoonSystem }) {
  return (
    <article className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-neon">{system.id} · {system.hostPlanet}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-100">{system.systemName}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{system.description}</p>
      </header>

      <ul className="mt-6 space-y-4">
        {system.moons.map((moon) => (
          <li key={moon.designation} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-medium text-slate-100">{moon.name}</h3>
              <span className="rounded-full border border-cyan-500/30 px-2 py-1 text-xs text-cyan-300">{moon.status}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{moon.designation} · {categoryLabel[moon.category]} · Orbit {moon.orbitalPeriod}</p>
            <p className="mt-2 text-sm text-slate-300">{moon.summary}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
