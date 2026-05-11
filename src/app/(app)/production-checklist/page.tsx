const checklist = ['Define module', 'Build WordPress plugin layer', 'Add App Bridge endpoints', 'Build admin UI', 'Build frontend dashboard', 'Connect ecosystem data', 'Add documentation files', 'Validate plugin', 'Package ZIP', 'Build and redeploy frontend'];

export default function ProductionChecklistPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Build Process / Production Checklist</h1>
        <p className="mt-2 text-slate-300">Use this checklist for every OneGodian plugin or app module release.</p>
      </section>
      <ol className="space-y-3">{checklist.map((item, i) => <li key={item} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><span className="mr-2 text-cyan-300">{i + 1}.</span>{item}</li>)}</ol>
    </main>
  );
}
