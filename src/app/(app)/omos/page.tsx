export default function OmosPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Operating System</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OMOS · OneGodian Metaphysical Operating System™</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Protocol, runtime documentation, page registry, and app bridge context for the OneGodian ecosystem.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Manifest', '/omos/manifest', 'Runtime manifest and compatibility context.'],
          ['Pages', '/omos/pages', 'Synced page registry for public routes.'],
          ['Health', '/omos/health', 'Operational status and sync visibility.']
        ].map(([title, href, description]) => (
          <a key={href} href={href} className="mobile-card group">
            <h2 className="text-xl font-semibold text-white group-hover:text-gold-200">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Open →</span>
          </a>
        ))}
      </section>
    </main>
  );
}
