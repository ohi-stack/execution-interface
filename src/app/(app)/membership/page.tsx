import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Member Access</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OneGodian Membership</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Membership pathways, records access, identity services, and voluntary community features across the OneGodian ecosystem.</p>
      </section>
      <section className="mobile-card text-sm leading-6 text-slate-300">
        <p>Use this page as the public-facing membership entry, then continue into member workflows and dashboard tools.</p>
        <p className="mt-3">Dashboard entry remains compatible with public/member reporting via manifest and status surfaces.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/members" className="premium-button-secondary">Open members module</Link>
          <Link href="/dashboard" className="premium-button">Open dashboard</Link>
        </div>
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Membership</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Membership</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Membership provides dashboard-linked participation paths, identity services, records access, and voluntary community features across the OneGodian ecosystem.</p>
      </section>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-sm leading-6 text-slate-300">
        <p>Use this page as the public-facing membership entry, then continue into member workflows, identity context, and dashboard tools.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/identity" className="font-semibold text-cyan-300">Open identity route</Link>
          <Link href="/dashboard" className="font-semibold text-cyan-300">Open dashboard</Link>
        </div>
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="mt-2 text-slate-300">Access OneGodian membership pathways, member records, benefits, onboarding, and participation options.</p>
      </section>
      <Link href="/members" className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Open Members</Link>
    </main>
  );
}
