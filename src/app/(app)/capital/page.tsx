const metrics = [
  ['Internal Strategic Valuation Estimate', '$52M'],
  ['3-Year Strategic Target Range', '$135M–$205M'],
  ['Execution Readiness Index', '71.4%'],
  ['Compliance & Verification Readiness', '82.6%']
];

export default function CapitalPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <h1 className="text-3xl font-black">Economic Intelligence Dashboard</h1>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </article>
        ))}
      </section>
      <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">Non-audited management estimate. Scenario-based growth projection. Not an audited market valuation, securities offering, or guarantee of future performance.</p>
    </main>
  );
}
