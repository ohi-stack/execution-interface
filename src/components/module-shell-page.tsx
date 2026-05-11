import Link from 'next/link';
import { notFound } from 'next/navigation';
import { appModules } from '@/lib/app-modules';

type ModuleShellPageProps = {
  slug: string;
};

export function ModuleShellPage({ slug }: ModuleShellPageProps) {
  const module = appModules.find((entry) => entry.slug === slug);

  if (!module) {
    return (
      <main className="min-h-screen text-slate-100">
        <section className="mx-auto max-w-6xl rounded-2xl border border-rose-500/40 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-rose-300">Module not found</p>
          <h1 className="mt-2 text-3xl font-bold">Missing module shell</h1>
          <p className="mt-3 text-slate-300">No module was found for slug: {slug}</p>
        </section>
      </main>
    );
  }

  const connectedSystems = module.connectedSystemIds
    .map((id) => appModules.find((entry) => entry.slug === id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{module.category} Module</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{module.title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">{module.title} operational shell page.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">ODIN Code</p>
            <p className="mt-2 text-lg font-semibold text-cyan-200">{module.odinCode}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold">{module.productionStatus}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Priority</p>
            <p className="mt-2 text-lg font-semibold">{module.priority}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Route</p>
            <p className="mt-2 text-lg font-semibold text-slate-200">{module.route}</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {module.features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold">Checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {module.checklist.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Connected Systems</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {connectedSystems.map((connected) => (
              <Link
                key={connected.slug}
                href={connected.route}
                className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-400/60"
              >
                <h3 className="font-semibold">{connected.title}</h3>
                <p className="mt-1 text-xs text-cyan-300">{connected.odinCode}</p>
                <p className="mt-2 text-sm text-slate-300">{connected.productionStatus} · {connected.priority}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
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
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{appModule.category} Module</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{pageTitle ?? appModule.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          {appModule.title} powers {appModule.domain} and is currently deployed to {appModule.deploymentTarget}.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['ODIN Code', appModule.odinCode],
          ['Status', appModule.productionStatus],
          ['Priority', appModule.priority],
          ['Version', appModule.version]
        ].map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold text-cyan-200">Features</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {appModule.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold text-cyan-200">Checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {appModule.checklist.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-cyan-200">Connected Systems</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {connectedSystems.map((connected) => (
            <Link
              key={connected.slug}
              href={connected.route}
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 transition hover:border-cyan-400/70"
            >
              <p className="text-sm font-semibold text-slate-100">{connected.title}</p>
              <p className="mt-1 text-xs text-slate-400">{connected.route}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
