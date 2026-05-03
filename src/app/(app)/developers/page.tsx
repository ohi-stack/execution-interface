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
