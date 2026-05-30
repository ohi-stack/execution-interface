export default function CommercePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Commerce & Identity Engine</h1>
        <p className="mt-2 text-slate-300">OneGodian.com is the commerce and identity product engine for merchandise, memberships, digital products, and checkout workflows.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Commercial Operations</h2>
          <p className="mt-2 text-sm text-slate-300">ONEGODIAN, LLC is a private commercial/IP/software/media/education/e-commerce entity operating commerce surfaces and product rails.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Commerce Node</h2>
          <a href="https://onegodian.com" target="_blank" rel="noreferrer" className="mt-2 inline-block text-cyan-300">https://onegodian.com</a>
        </article>
      </section>
    </main>
  );
}
