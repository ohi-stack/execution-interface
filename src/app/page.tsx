import Link from 'next/link';

const actions = [
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'OMOS', href: '/omos' },
  { label: 'Remember', href: '/remember' },
  { label: 'Membership', href: '/membership' },
  { label: 'Time', href: '/time' },
  { label: 'Commerce', href: '/commerce' },
  { label: 'Institutional', href: '/institutional' }
];

export default function HomePage() {
  return (
    <main className="space-y-8">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OneGodian App · Live Production Node</p>
        <h1 className="mt-3 text-4xl font-bold">OneGodian Public + Member Experience</h1>
        <p className="mt-4 max-w-4xl text-slate-300">
          This app provides public-safe pages, dashboard-linked entries, and system visibility across the OneGodian ecosystem.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-cyan-100">
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
