import Link from 'next/link';
import { notFound } from 'next/navigation';
import { appModules } from '@/lib/app-modules';

type ModuleShellPageProps = {
  slug: string;
  pageTitle?: string;
};

export function ModuleShellPage({ slug, pageTitle }: ModuleShellPageProps) {
  const appModule = appModules.find((item) => item.slug === slug);
  if (!appModule) notFound();

  const connectedSystems = appModule.connectedSystemIds
    .map((id) => appModules.find((item) => item.slug === id))
    .filter((item): item is (typeof appModules)[number] => Boolean(item));

  return (
    <main className="space-y-6 text-slate-100">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">{appModule.category} Module</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">{pageTitle ?? appModule.title}</h1>
      </section>
      <section className="mobile-card">
        <h2 className="text-lg font-bold text-white">Connected Systems</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {connectedSystems.map((connected) => (
            <Link key={connected.slug} href={connected.route} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold-300/40 hover:bg-gold-300/10">
              <p className="text-sm font-semibold text-white">{connected.title}</p>
              <p className="mt-1 text-xs text-purple-100/75">{connected.route}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
