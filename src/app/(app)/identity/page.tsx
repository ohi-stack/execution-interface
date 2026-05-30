export default function IdentityPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Membership / Identity</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Identity</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Identity defines how OneGodian membership, records, credentials, product access, voluntary participation, and institutional context are represented across application and commerce surfaces.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Membership Records</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Membership identity supports voluntary participation, dashboard continuity, credential references, and member-facing access flows.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Product Identity</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">OneGodian.com connects product, membership, and checkout identity while this app provides public and member-facing route context.</p>
        </article>
        <article className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 md:col-span-2">
          <h2 className="text-xl font-semibold text-amber-100">Boundary</h2>
          <p className="mt-2 text-sm leading-6 text-amber-50/80">Identity language does not create exemption from law or authority over non-members. Participation is voluntary and public claims remain aligned to commercial, cultural, and internal association boundaries.</p>
        </article>
      </section>
    </main>
  );
}
