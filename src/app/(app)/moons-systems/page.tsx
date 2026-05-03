import { MoonSystemCard } from '@/components/moon-system-card';
import { ONEGODIAN_MOON_SYSTEMS } from '@/lib/moons-systems';

export default function MoonsSystemsPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">OneGodian Galaxy™</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Moons &amp; Systems Registry</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Explore active, survey, and queued moon systems across the OneGodian planetary network. This registry is modular by design so new moon clusters can be added without changing layout or structure.
          </p>
        </header>

        <section aria-label="Moon systems" className="mt-10 grid gap-6 lg:grid-cols-2">
          {ONEGODIAN_MOON_SYSTEMS.map((system) => (
            <MoonSystemCard key={system.id} system={system} />
          ))}
        </section>
      </div>
    </main>
  );
}
