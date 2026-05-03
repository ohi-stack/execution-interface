import { ModuleCard } from '@/components/module-card';

export function AppShell({ title, modules }: { title: string; modules: { title: string; description: string; href?: string }[] }) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-wide text-slate-100">{title}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>
    </main>
  );
}
