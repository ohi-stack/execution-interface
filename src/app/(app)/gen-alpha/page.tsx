const stages = ['Explorer', 'Aligned', 'Activated', 'Guide'];
export default function GenAlphaPage() {
  return <main className="p-6 text-slate-100"><h1 className="text-3xl font-semibold">Gen Alpha</h1><p className="mt-3 text-slate-300">Belief Mapper Lite introduces gamified stage progression.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stages.map((stage)=> <div key={stage} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">{stage}</div>)}</div></main>;
}
