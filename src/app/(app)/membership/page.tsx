import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="mt-2 text-slate-300">Membership pathways, records access, and participation tools across the OneGodian App.</p>
      </section>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-sm text-slate-300">
        <p>Use this page as the public-facing membership entry, then continue into member workflows and dashboard tools.</p>
        <div className="mt-3 flex gap-4">
          <Link href="/members" className="text-cyan-300">Open members module</Link>
          <Link href="/dashboard" className="text-cyan-300">Open dashboard</Link>
        </div>
      </section>
    </main>
  );
}
