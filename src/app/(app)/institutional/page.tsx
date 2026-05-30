export default function InstitutionalPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Institutional Clarity</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OneGodian Institutional Boundaries</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Clear public-facing language for commercial operations, educational/media activity, community participation, and verification infrastructure.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">ONEGODIAN, LLC</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Private commercial/IP/software/media/education/e-commerce operations, products, and platform services.</p>
        </article>
        <article className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Public + Member App</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Public-safe routes, member entry points, campaign resources, content context, and status surfaces remain separate from admin/control tools.</p>
        </article>
      </section>
    </main>
  );
}
