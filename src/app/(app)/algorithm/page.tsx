export default function AlgorithmPage() {
  const layers = ['Protocol', 'Experience', 'Community', 'Orientation'];
  return <main className="p-6 text-slate-100"><h1 className="text-3xl font-semibold">Algorithm</h1><p className="mt-3 text-slate-300">The OneGodian algorithm framework is organized into four operational layers.</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{layers.map((l)=> <li key={l} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">{l}</li>)}</ul></main>;
}
