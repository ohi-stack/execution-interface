export function OneGodianIdHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 px-6 py-14 shadow-2xl shadow-black/30 sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(135deg,rgba(15,23,42,1),rgba(8,47,73,0.82),rgba(15,23,42,1))]" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">
            OneGodian Identity Infrastructure
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">OneGodian ID Card™</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            A supplemental religious identity credential for documenting sincerely held belief identity, internal membership affiliation, and QR-V verification inside the OneGodian ecosystem.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/dashboard/id-card" className="rounded-full bg-cyan-300 px-6 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-200">Open My ID Card</a>
            <a href="/admin/id-cards" className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10">Admin Console</a>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">Credential Role</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div><dt className="text-slate-400">Legal Position</dt><dd className="mt-1 font-semibold text-white">Sincerely held belief documentation</dd></div>
            <div><dt className="text-slate-400">Institutional Role</dt><dd className="mt-1 font-semibold text-white">Supplemental identity credential</dd></div>
            <div><dt className="text-slate-400">Verification Layer</dt><dd className="mt-1 font-semibold text-white">QR-V / OBP-1 ready</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
