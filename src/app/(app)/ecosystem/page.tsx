import { ecosystemPortals } from '@/lib/app-content';

export default function EcosystemPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Ecosystem</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Production Ecosystem</h1>
        <p className="mt-3 max-w-4xl text-slate-300">The OneGodian ecosystem separates commercial product operations, public cultural interpretation, member-facing application workflows, education, protocol documentation, and verification infrastructure.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {ecosystemPortals.map((portal) => (
          <article key={portal.name} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{portal.classification}</p>
            <h2 className="mt-2 text-xl font-semibold text-cyan-100">{portal.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{portal.role}</p>
            <a href={portal.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-cyan-300">{portal.url}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
