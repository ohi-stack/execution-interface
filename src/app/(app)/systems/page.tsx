const hierarchy = ['Founder','Framework','Institutional','Platform','Systems','Registry','Commerce','Infrastructure'];
const coreSystems = ['OHI™','Quantum-OHI™','OMOS™','ACC™','OBP-1™','OTS-V5™'];

export default function SystemsPage() {
  return <main className="space-y-6">
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">OneGodian Systems</h1><p className="mt-2 text-slate-300">Architecture, infrastructure positioning, and investor-facing systems map.</p></section>
    <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">🌐 OneGodian Ecosystem Hierarchy</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{hierarchy.map((i,idx)=><div key={i} className="rounded border border-cyan-500/20 p-3">{idx+1}. {i}</div>)}</div></section>
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{coreSystems.map((s)=><article key={s} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h3 className="font-semibold">{s}</h3><p className="mt-2 text-sm text-slate-300">Status: Active • Runtime: Syncing • Docs: Pending link</p></article>)}</section>
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold">🏗 Infrastructure Layer</h2><p className="mt-2 text-slate-300">Identity, verification, execution, and infrastructure orchestration combine into a unified systems-runtime layer for operational delivery.</p></section>
  </main>;
}
