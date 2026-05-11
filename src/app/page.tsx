import Link from 'next/link';

const ctas = [
  { label: 'Enter Dashboard', href: '/dashboard' },
  { label: 'View Ecosystem', href: '/ecosystem' },
  { label: 'Explore Tools', href: '/tools' },
  { label: 'View Registry', href: '/registry' }
];

const footerColumns = [
  { title: 'App', links: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Ecosystem', href: '/ecosystem' }, { label: 'Tools', href: '/tools' }, { label: 'Registry', href: '/registry' }] },
  { title: 'Systems', links: [{ label: 'Plugins', href: '/plugins' }, { label: 'App Bridge', href: '/app-bridge' }, { label: 'Certificates', href: '/certificates' }, { label: 'Products', href: '/products' }] },
  { title: 'Resources', links: [{ label: 'Documentation', href: '/docs' }, { label: 'Production Checklist', href: '/production-checklist' }, { label: 'Media', href: '/media' }, { label: 'Settings', href: '/settings' }] },
  { title: 'Network', links: [{ label: 'OneGodian.com', href: 'https://onegodian.com' }, { label: 'OneGodian.org', href: 'https://onegodian.org' }, { label: 'U.OneGodian.org', href: 'https://u.onegodian.org' }, { label: 'Capital.OneGodian.com', href: 'https://capital.onegodian.com' }] }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8 sm:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OneGodian Ecosystem</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">OneGodian App</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">The command interface for the OneGodian ecosystem.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ctas.map((cta) => (
              <Link key={cta.href} href={cta.href} className="rounded-xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-center text-sm font-medium hover:border-cyan-400/60 hover:text-cyan-200">
                {cta.label}
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-10 grid gap-6 border-t border-slate-800 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-cyan-300">{column.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-cyan-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>
      </div>
    </main>
  );
}
