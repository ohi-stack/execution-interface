import Link from 'next/link';
const cards=[{title:'API Docs',description:'Runtime endpoints, environments, and integration docs.'},{title:'Repository Links',description:'execution-interface, acc-api, and instryx-financial-interface.'},{title:'Health Endpoints',description:'Bridge health checks, manifests, and plugin readiness.'}];
export default function DevelopersPage(){return <main className="space-y-8"><section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8"><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · DEVELOPERS</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Developer Center</h1><p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">API documentation, repository links, bridge endpoints, app manifests, and integration instructions.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/systems" className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">View Systems</Link><Link href="/" className="rounded-lg border border-cyan-400/60 px-4 py-2 text-sm font-semibold text-cyan-200">Back to Dashboard</Link></div></section><section className="grid gap-4 md:grid-cols-3">{cards.map(c=><article key={c.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><h2 className="text-xl font-semibold text-white">{c.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-300">{c.description}</p></article>)}</section><section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-sm text-slate-300">Roadmap: Plugin bridge docs pending • API health panel pending • SDK layer planned.</section></main>}
const repos = ['execution-interface', 'acc-api', 'instryx-financial-interface'];

export default function DevelopersPage() {
  return <main className="space-y-6">
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">Developer Center</h1><p className="mt-2 text-slate-300">Repositories, APIs, SDK placeholders, and runtime documentation.</p></section>
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-xl border border-slate-700 p-4"><h2 className="font-semibold">🔗 Repositories</h2><ul className="mt-3 space-y-1 text-sm text-slate-300">{repos.map((r)=><li key={r}>• {r}</li>)}</ul></article>
      <article className="rounded-xl border border-slate-700 p-4"><h2 className="font-semibold">📡 APIs</h2><p className="mt-3 text-sm text-slate-300">Status, endpoints, and environment readiness panels.</p></article>
      <article className="rounded-xl border border-slate-700 p-4"><h2 className="font-semibold">🧩 SDKs</h2><p className="mt-3 text-sm text-slate-300">Future placeholder for package distribution.</p></article>
      <article className="rounded-xl border border-slate-700 p-4"><h2 className="font-semibold">📘 Docs</h2><p className="mt-3 text-sm text-slate-300">Architecture and runtime documentation index.</p></article>
    </section>
  </main>;
}
