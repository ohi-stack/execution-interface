import { ecosystemPortals } from '@/lib/onegodian-content';

export default function EcosystemPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">OneGodian Ecosystem</h1>
      <p className="text-slate-300">Connected properties across identity, commerce, education, runtime systems, and verification infrastructure.</p>
      <section className="grid gap-4 md:grid-cols-2">
        {ecosystemPortals.map((portal) => (
          <article key={portal.name} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="font-semibold">{portal.name}</h2>
            <p className="text-sm text-slate-300">{portal.role}</p>
            <a href={portal.url} target="_blank" rel="noreferrer" className="text-cyan-300">{portal.url}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
