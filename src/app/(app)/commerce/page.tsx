export default function CommercePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Commerce Engine</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian.com Commerce + Identity Product Engine</h1>
        <p className="mt-3 max-w-4xl text-slate-300">OneGodian.com is the commerce and identity product engine for ONEGODIAN, LLC products, memberships, media, education products, checkout workflows, fulfillment, and product-linked identity experiences.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Commercial Operations</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">ONEGODIAN, LLC operates as a private commercial/IP/software/media/education/e-commerce entity. Commerce pages should describe products, services, memberships, digital goods, and fulfillment without implying governmental status.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Primary Engine</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Use OneGodian.com as the product engine and identity-linked checkout destination.</p>
          <a href="https://onegodian.com" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-cyan-300">https://onegodian.com</a>
        </article>
      </section>
    </main>
  );
}
