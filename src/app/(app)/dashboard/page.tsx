import Link from 'next/link';
import { appModules, criticalSystems, liveSystems } from '@/lib/app-modules';

export const metadata = {
  title: 'OneGodian App | Command Dashboard',
  description: 'Operational command surface for OneGodian systems.'
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Operational Command Surface</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>Systems: {appModules.length}</span>
            <span>Live: {liveSystems.length}</span>
            <span>Critical: {criticalSystems.length}</span>
          </div>
        </header>
        <section>
          <h2 className="mb-3 text-xl font-semibold">System Modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {appModules.map((module) => (
              <Link key={module.slug} href={module.route} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-cyan-400/60">
                <h3 className="font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{module.odinCode} · {module.version}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
