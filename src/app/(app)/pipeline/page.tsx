const steps = ['Compare', 'Filter', 'Normalize', 'Output'];
export default function PipelinePage() {
  return <main className="p-6 text-slate-100"><h1 className="text-3xl font-semibold">Pipeline</h1><p className="mt-3 text-slate-300">Visual workflow for operational data handling.</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{steps.map((s)=> <div key={s} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center">{s}</div>)}</div></main>;
}
