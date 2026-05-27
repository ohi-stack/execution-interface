export default function TimePage() {
  return (
    <main className="space-y-6 p-6 text-slate-100">
      <h1 className="text-3xl font-semibold">OneGodian Time™ / OTS-V5</h1>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-300 space-y-2">
        <p>Dual-date display model: Gregorian civil date + OneGodian internal date notation for synchronized cultural references.</p>
        <p>Example format: Gregorian Date (UTC) · OneGodian Date (OTS-V5 internal).</p>
      </section>
      <p className="text-sm text-amber-200">Legal safety: Gregorian calendar/time remains controlling for legal, financial, compliance, and external institutional matters.</p>
    </main>
  );
}
