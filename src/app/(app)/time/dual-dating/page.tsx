const cardClass = "rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-5 shadow-[0_0_30px_rgba(6,182,212,0.08)]";

export default function DualDatingPage() {
  return (
    <main className="min-h-screen space-y-6 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 pb-10 text-slate-100 sm:p-6">
      <section className="rounded-3xl border border-cyan-400/30 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">OTS-V5 Standard</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-100 sm:text-4xl">Dual Dating System™</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">
          Gregorian Time controls legally. OneGodian Time provides internal sequencing.
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">What Dual Dating Means</h2>
        <p className="mt-3 text-slate-300">
          OTS-V5 requires two coordinated references: Gregorian Time (GT) for external/legal clarity and
          OneGodian Time™ (OT) for supplemental internal sequencing.
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Required Format</h2>
        <p className="mt-3 text-slate-300">Use OT with GT in parentheses for public context:</p>
        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-cyan-100">
          Genesis 07, 0000 OT (March 24, 2025)
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Legal Priority Rule</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Gregorian Time (GT) remains the controlling legal reference.</li>
          <li>OneGodian Time™ (OT) is supplemental/internal.</li>
          <li>
            Do not use OT-only dates for court, contracts, invoices, taxes, banking, or government
            correspondence.
          </li>
        </ul>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Public Display Examples</h2>
        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
          <p className="text-sm uppercase tracking-wide text-slate-400">Public</p>
          <p className="mt-1 text-cyan-100">Genesis 07, 0000 OT (March 24, 2025)</p>
        </div>
        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
          <p className="text-sm uppercase tracking-wide text-slate-400">Formal</p>
          <p className="mt-1">Date: March 24, 2025</p>
          <p>OneGodian Date: Genesis 07, 0000 OT</p>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Governance Record Format</h2>
        <p className="mt-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
          Recorded on Genesis 07, 0000 OT (March 24, 2025), at 8:45 PM EST, Waterbury, Connecticut.
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Financial Instrument Format</h2>
        <p className="mt-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
          Dated as of March 24, 2025 (Genesis 07, 0000 OT)
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Database Storage Rules</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>UTC is the system truth for databases.</li>
          <li>OT must be computed, not stored as the primary source.</li>
          <li>Store GT/UTC timestamps as canonical values; render OT during presentation.</li>
        </ul>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Common Mistakes to Avoid</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Publishing OT-only records in legal or financial workflows.</li>
          <li>Using OT as authoritative database source fields.</li>
          <li>Omitting GT when displaying public or archived records.</li>
        </ul>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold text-amber-200">Implementation Widgets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4">Format Builder</div>
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4">Legal-Safe Example Card</div>
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4">Database Fields Card</div>
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4">Do / Don’t Checklist</div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-center">
        <p className="text-sm text-amber-100">Need calendar conversions and references?</p>
        <a href="/time" className="mt-2 inline-block rounded-lg border border-cyan-400/60 px-4 py-2 font-semibold text-cyan-100 hover:bg-cyan-500/10">
          ← Back to Time
        </a>
      </section>
    </main>
  );
}
