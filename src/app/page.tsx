import Link from 'next/link';

const routes = [
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/omos', label: 'OMOS' },
  { href: '/remember', label: 'Remember' },
  { href: '/membership', label: 'Membership' },
  { href: '/time', label: 'Time' },
  { href: '/commerce', label: 'Commerce' },
  { href: '/institutional', label: 'Institutional' },
  { href: '/tools', label: 'Tools' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/registry', label: 'Registry' },
  { href: '/members', label: 'Members' },
  { href: '/settings', label: 'Settings' },
  { href: '/dashboard', label: 'Dashboard' }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OneGodian App</p>
          <h1 className="mt-2 text-4xl font-bold">Live Public + Member Application Node</h1>
          <p className="mt-3 text-slate-300">Production content routes for ecosystem, OMOS, remembrance, membership, time, commerce, institutional clarity, and planned control-plane surfaces.</p>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-cyan-200 hover:border-cyan-400/50">
              {route.label}
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
