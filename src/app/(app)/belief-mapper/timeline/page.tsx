const timeline = [
  { title: 'Question flow', description: 'Answer the mobile-first swipe/tap prompt set.' },
  { title: 'Immediate result', description: 'Receive Seeker, Believer, Onegodian, or Elder guidance.' },
  { title: 'Journal checkpoint', description: 'Capture private reflection before storing any sensitive data.' },
  { title: 'Profile and certificate', description: 'Opt into saved profile, certificate preview, and member next steps.' }
];

export default function BeliefMapperTimelinePage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Timeline</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Belief Mapper™ journey timeline</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-4">
        {timeline.map((item, index) => (
          <article key={item.title} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
            <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">{index + 1}</span>
            <h2 className="mt-4 text-lg font-semibold text-slate-100">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
