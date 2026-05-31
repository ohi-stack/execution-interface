export default function CommercePage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Commerce Node</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">Commerce & Identity Engine</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          OneGodian.com is the commerce and identity product engine for merchandise, memberships, digital products, and checkout workflows.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Commercial Operations</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            ONEGODIAN, LLC operates as a private commercial/IP/software/media/education/e-commerce entity.
          </p>
        </article>
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Primary Engine</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Use OneGodian.com as the product engine and identity-linked checkout destination.
          </p>
          <a href="https://onegodian.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-gold-300 hover:text-gold-100">
            https://onegodian.com
          </a>
        </article>
      </section>
    </main>
  );
}
