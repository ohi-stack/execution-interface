import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
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
      </section>
    </main>
  );
}
