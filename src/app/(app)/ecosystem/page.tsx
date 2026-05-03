import { ONEGODIAN_ECOSYSTEM } from '@/lib/ecosystem';

export default function EcosystemPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">OneGodian Galaxy™</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Ecosystem</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Core production modules mirrored for deployment while preserving compatibility with the current Hostinger build.
          </p>
        </header>

        <section aria-label="Ecosystem modules" className="mt-10 grid gap-4 sm:grid-cols-2">
          {ONEGODIAN_ECOSYSTEM.map((module) => (
            <article key={module.id} className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neon">{module.id}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-100">{module.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{module.description}</p>
              <p className="mt-3 text-xs text-slate-400">
                {module.category} · {module.productionStatus}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
