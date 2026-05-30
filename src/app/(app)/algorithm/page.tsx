const layers = [
  { title: 'Protocol', detail: 'The rules, route definitions, manifests, vocabulary, safety boundaries, and structured references that make OneGodian systems interoperable.' },
  { title: 'Experience', detail: 'The user-facing dashboard, content, tools, campaigns, identity flows, and time displays that make the system understandable and usable.' },
  { title: 'Community', detail: 'The voluntary participation layer for shared memory, membership, cultural context, public education, and human support.' },
  { title: 'Orientation', detail: 'The alignment layer that keeps language, AI behavior, public claims, legal boundaries, and institutional roles pointed in the correct direction.' }
];

export default function AlgorithmPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Operating Algorithm</p>
        <h1 className="mt-2 text-3xl font-black">The OneGodian Algorithm</h1>
        <p className="mt-3 max-w-4xl text-slate-300">The OneGodian Algorithm is summarized as a four-layer operating model: Protocol, Experience, Community, and Orientation. Together they describe how the ecosystem names things, presents them, invites participation, and keeps claims aligned.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {layers.map((layer) => (
          <article key={layer.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold text-cyan-100">{layer.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{layer.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
