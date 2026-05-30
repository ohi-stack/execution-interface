export function CertificatePreview({ name = 'OneGodian Member', resultTitle = 'Belief Mapper™ Participant' }: { name?: string; resultTitle?: string }) {
  return (
    <section className="rounded-[2rem] border border-cyan-300/40 bg-slate-950 p-6 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)]">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Certificate Preview</p>
      <div className="mt-5 rounded-3xl border border-slate-700 bg-slate-900/70 p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">OneGodian App</p>
        <h2 className="mt-4 text-3xl font-bold text-slate-100">Belief Mapper™ Completion</h2>
        <p className="mt-6 text-sm text-slate-400">Presented to</p>
        <p className="mt-2 text-2xl font-semibold text-cyan-100">{name}</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">For completing the {resultTitle} pathway checkpoint with consent-first reflection.</p>
      </div>
    </section>
  );
}
