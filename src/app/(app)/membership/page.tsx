import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Membership</h1>
        <p className="mt-2 text-slate-300">Membership pathways for profile records, campaign participation, tools, and platform learning resources.</p>
      </section>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-300">
        <p>Dashboard entry is available from the member node and remains compatible with admin/control-plane reporting via manifest and status surfaces.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-cyan-300">Open dashboard</Link>
      </section>
    </main>
  );
}
