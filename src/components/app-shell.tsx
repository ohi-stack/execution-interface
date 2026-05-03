import Link from 'next/link';
import { ModuleCard } from '@/components/module-card';

type Module = {
  title: string;
  description: string;
  href?: string;
  accent?: 'cyan' | 'gold' | 'violet' | 'emerald' | 'magenta' | 'orange' | 'red' | 'silver';
  stats?: string[];
  glyph?: 'planet' | 'moons' | 'ecosystem' | 'registry' | 'media' | 'tools' | 'certificates' | 'dashboard';
  featured?: boolean;
};

const mobileNav = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Registry', href: '/planetary-registry' },
  { label: 'Moons', href: '/moons-systems' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Profile', href: '/profile' }
];

export function AppShell({ title, modules }: { title: string; modules: Module[] }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.22),transparent_28%),radial-gradient(circle_at_85%_5%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(2,6,23,.88))]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.1)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="mx-auto max-w-6xl">
        <h1 className="relative text-3xl font-bold tracking-wide text-slate-100">{title}</h1>
        <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-20 rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-2 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5 gap-1 text-center text-[11px] text-slate-300">
          {mobileNav.map((item) => (
            <li key={item.label}><Link href={item.href} className="block rounded-lg px-1 py-2 hover:bg-slate-800/80 hover:text-cyan-200">{item.label}</Link></li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
