import Link from 'next/link';

const actions = [
  { label: 'View certificate records', href: '/certificates' },
  { label: 'Open account settings', href: '/account' },
  { label: 'Explore community tools', href: '/tools' }
];

export default function MembersPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Member Infrastructure</p>
        <h1 className="mt-2 text-3xl font-bold">Members</h1>
        <p className="mt-3 max-w-4xl text-slate-300">
          Access your OneGodian member profile, membership status, digital ID, certificate records, and community tools.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-cyan-200 hover:border-cyan-400/60">
            {action.label} →
          </Link>
        ))}
      </section>
    </main>
  );
}
