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
      </section>
    </main>
  );
}
