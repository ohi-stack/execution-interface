import { ecosystemPortals } from '@/lib/app-content';

export default function EcosystemPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Ecosystem Registry</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OneGodian Ecosystem</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Connected properties across identity, commerce, education, runtime systems, galaxy surfaces, and verification infrastructure.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {ecosystemPortals.map((portal) => (
          <article key={portal.name} className="mobile-card">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{portal.classification}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{portal.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{portal.role}</p>
            <a href={portal.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-gold-300 hover:text-gold-100">
              {portal.url}
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
