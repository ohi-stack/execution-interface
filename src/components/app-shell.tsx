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
    <main className="onegodian-surface relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(234,200,90,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,.12)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="relative mx-auto max-w-6xl">
        <section className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Production Dashboard</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">{title}</h1>
        </section>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>
    </main>
  );
}
