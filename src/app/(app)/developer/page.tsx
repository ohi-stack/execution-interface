import Link from 'next/link';

const developerLinks = [
  { title: 'System Health', href: '/system-health', description: 'Review runtime and application health surfaces.' },
  { title: 'API Status', href: '/api-status', description: 'Open API status and route readiness references.' },
  { title: 'Documentation', href: '/docs', description: 'Read platform guides, standards, and implementation notes.' },
  { title: 'OMOS Runtime', href: '/omos', description: 'Connect with protocol, manifest, and runtime node information.' },
  { title: 'ODIN Registry', href: '/odin', description: 'Open registry and canon-linked system interfaces.' },
  { title: 'App Structure', href: '/standards/app-structure', description: 'Review route, navigation, and platform structure standards.' }
];

export default function DeveloperPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Developer Hub</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">Developer</h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300">
          Developer access collects app structure, runtime references, API status, documentation, ODIN system links, and operational implementation notes for the OneGodian app layer.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {developerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="mobile-card block">
            <h2 className="text-xl font-black text-white">{link.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{link.description}</p>
            <span className="mt-5 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">Open →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
