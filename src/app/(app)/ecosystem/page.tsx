import { ecosystemPortals } from '@/lib/onegodian-content';

export default function EcosystemPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Ecosystem</h1>
        <p className="mt-2 text-slate-300">Connected properties across identity, commerce, education, runtime systems, and verification infrastructure.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {ecosystemPortals.map((portal) => (
          <article key={portal.name} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold text-slate-100">{portal.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{portal.role}</p>
            <a href={portal.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-cyan-300">{portal.url}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
