import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="mt-2 text-slate-300">Access OneGodian membership pathways, member records, benefits, onboarding, and participation options.</p>
      </section>
      <Link href="/members" className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Open Members</Link>
    </main>
  );
}
