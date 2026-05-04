import Link from 'next/link';

const layers = [
  { title: 'Protocol Layer', desc: 'Recognition and classification standards for AI-safe identity handling.' },
  { title: 'Experience Layer', desc: 'User-facing intelligence and personalization for trusted interactions.' },
  { title: 'Community Layer', desc: 'Community coherence, governance, and participation pathways.' },
  { title: 'Orientation Layer', desc: 'Behavioral orientation standards for agents and autonomous systems.' }
];

export default function AlgorithmPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
        <h1 className="text-3xl font-black">The OneGodian Algorithm™</h1>
        <p className="mt-2 text-slate-300">Operational AI architecture for protocol, experience, community, and orientation control layers.</p>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        {layers.map((layer) => (
          <article key={layer.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold">{layer.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{layer.desc}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-5"><h2 className="text-lg font-semibold">AI System Prompt</h2><p className="mt-2 text-sm text-slate-300">Canonical safety, legal framing, mission constraints, and response governance are enforced through the system prompt layer.</p></article>
        <article className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5"><h2 className="text-lg font-semibold">Implementation Roadmap</h2><p className="mt-2 text-sm text-slate-300">Sequence: standards hardening, module integration, telemetry, API orchestration, and policy-compliance verification.</p></article>
      </section>
      <Link href="https://github.com/ohi-stack/execution-interface" className="inline-flex rounded-xl border border-cyan-400/70 px-4 py-2 font-semibold text-cyan-200">View GitHub Repository</Link>
    </main>
  );
}
