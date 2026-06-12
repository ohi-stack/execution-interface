import { ModuleCard } from '@/components/ModuleCard';
import { PageHeader } from '@/components/PageHeader';
import { dashboardModules } from '@/lib/acc-content';

export default function Page() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="Member Dashboard" title="OneGodian App Dashboard" description="Open the current OneGodian member, contributor, creator, affiliate, certificate, product, media, learning, registry, tools, and settings modules." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardModules.map((module) => <ModuleCard key={module.href} module={module} />)}
      </section>
    </main>
  );
}
