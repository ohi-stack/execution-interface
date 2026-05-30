const overviewPoints = [
  'ONEGODIAN, LLC is the private commercial/IP/software/media/education/e-commerce entity responsible for production product execution.',
  'The company organizes software, media, educational, identity, and commerce assets into a coherent OneGodian ecosystem.',
  'The May 26, 2026 overview positions the LLC as the operating entity for app surfaces, product infrastructure, content systems, and commercial delivery.',
  'Public communication should keep commercial operations, cultural interpretation, and internal voluntary association structures distinct.'
];

export default function OverviewPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">May 26, 2026 Overview</p>
        <h1 className="mt-2 text-3xl font-bold">ONEGODIAN, LLC Production Overview</h1>
        <p className="mt-3 max-w-4xl text-slate-300">This overview summarizes ONEGODIAN, LLC as the production-facing company behind commercial intellectual property, software, media, education, e-commerce, and product identity systems.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Operating Summary</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
            {overviewPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </article>
        <article className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="text-xl font-semibold text-amber-100">Public-Safe Boundary</h2>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">ONEGODIAN, LLC is commercial and private. INO is separate and described as a voluntary internal governance/religious association structure. Sovereign language means internal self-governance and voluntary participation only.</p>
        </article>
      </section>
    </main>
  );
}
