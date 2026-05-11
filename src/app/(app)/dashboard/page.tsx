import Link from 'next/link';

const cards = [
  { title: 'Systems', href: '/ecosystem' },
  { title: 'Plugins', href: '/plugins' },
  { title: 'Registry', href: '/registry' },
  { title: 'Tools', href: '/tools' },
  { title: 'Certificates', href: '/certificates' },
  { title: 'Members', href: '/members' },
  { title: 'Products', href: '/products' },
  { title: 'Media', href: '/media' },
  { title: 'App Bridge', href: '/app-bridge' },
  { title: 'Production Checklist', href: '/production-checklist' }
];

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian App Dashboard</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Central command interface for systems, plugins, dashboards, tools, registries, media, products, certificates, and ecosystem navigation.</p>
      </header>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Command Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-400/60">
              <h3 className="font-medium">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">Open {card.title} interface.</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
