export default function OmosPage() {
  const layers = ['Protocol documentation', 'Runtime health', 'Manifest delivery', 'Plugin bridge', 'Agent-facing integration'];

  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">OMOS Runtime</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OneGodian Metaphysical Operating System™</h1>
        <p className="mt-3 max-w-3xl text-slate-300">OMOS is the protocol, documentation, runtime-support, and agent-facing integration layer.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {layers.map((layer) => (
          <article key={layer} className="mobile-card">
            <h2 className="text-xl font-semibold text-white">{layer}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Production-facing OMOS surface for {layer.toLowerCase()}.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
