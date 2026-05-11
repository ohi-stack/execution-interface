const layers = ['Public App Layer', 'Dashboard Layer', 'Admin Layer', 'API / App Bridge Layer', 'Data Layer', 'Security Layer', 'UI / UX Layer', 'Documentation Layer', 'Compliance Layer', 'Deployment Layer'];

export default function PluginsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Plugin Development Framework</h1>
        <p className="mt-3 text-slate-300">Build plugins as full lifecycle modules aligned to the OneGodian App command interface.</p>
      </section>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">10-layer plugin architecture</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{layers.map((layer) => <article key={layer} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm">{layer}</article>)}</div>
      </section>
    </main>
  );
}
