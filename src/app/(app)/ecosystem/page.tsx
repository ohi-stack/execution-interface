import { EcosystemSystemCard } from '@/components/ecosystem-system-card';
import { ECOSYSTEM_CATEGORIES, ONEGODIAN_ECOSYSTEM_SYSTEMS } from '@/lib/ecosystem';

export default function EcosystemPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">OneGodian Ecosystem Directory</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Connected systems, sync-ready architecture.</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">WordPress markets it. Node manages it. ODIN indexes it. The app connects it.</p>
        </header>

        <section className="mt-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-slate-400">Categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {ECOSYSTEM_CATEGORIES.map((category) => (
              <span key={category} className="rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1 text-xs text-slate-200">{category}</span>
            ))}
          </div>
        </section>

        <section aria-label="Ecosystem systems" className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ONEGODIAN_ECOSYSTEM_SYSTEMS.map((system) => (
            <EcosystemSystemCard key={system.id} system={system} />
          ))}
        </section>
      </div>
    </main>
  );
}
