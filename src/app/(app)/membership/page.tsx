import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Membership</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">Member Access & Records</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Membership routes support profile records, certificates, status, and participation tools.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/members" className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Members</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Open the member infrastructure route.</p>
        </Link>
        <Link href="/belief-mapper" className="mobile-card">
          <h2 className="text-xl font-semibold text-white">Belief Mapper™</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Start or review belief mapping surfaces.</p>
        </Link>
      </section>
    </main>
  );
}
