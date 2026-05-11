const milestones = [
  { date: 'April 17, 2026', title: 'Operational milestone record logged', detail: 'Internal milestone package compiled for command dashboard continuity.' },
  { date: 'April 28, 2026', title: 'Decision log migration added', detail: 'Database migration added to track software decision records.' },
  { date: 'May 2026', title: 'Command module routes aligned', detail: 'Core routes for algorithm, time, docs, identity, pipeline, and Gen Alpha aligned.' },
  { date: 'May 2026', title: 'Dashboard status model standardized', detail: 'Live, In Development, Needs Setup, and Planned labels adopted across command cards.' }
];

export default function MilestonesPage() {
  return (
    <main className="space-y-5 text-slate-100">
      <h1 className="text-3xl font-semibold">Milestones</h1>
      <p className="text-slate-300">Major OneGodian records and software milestones used for operational reference.</p>
      <div className="space-y-3">
        {milestones.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-300">{item.date}</p>
            <h2 className="mt-1 font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
