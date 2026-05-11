export default function IdentityPage() {
  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Identity</h1>
        <p className="mt-3 text-slate-300">Identity defines how OneGodian records, ownership references, and institutional context are represented across software.</p>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="font-semibold">Copyright + Commercial Context</h2>
          <p className="mt-2 text-sm text-slate-300">ONEGODIAN, LLC is the commercial and technology operating entity for software, IP, and implementation assets.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="font-semibold">Entity Separation</h2>
          <p className="mt-2 text-sm text-slate-300">INO remains separate for spiritual and community governance functions and is not represented here as a commercial authority.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 md:col-span-2">
          <h2 className="font-semibold">Institutional Records</h2>
          <p className="mt-2 text-sm text-slate-300">Institutional records include dated filings, certificates, and internal continuity notes used for operational reference.</p>
        </article>
      </section>
    </main>
  );
}
