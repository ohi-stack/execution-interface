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

export function AppShell({ title, modules }: { title: string; modules: Module[] }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
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
    </main>
  );
}
