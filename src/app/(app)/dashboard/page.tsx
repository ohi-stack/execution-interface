import { DashboardModules, PageHero } from '@/components/OneGodianAppPages';

export default function DashboardPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero
        eyebrow="Member dashboard"
        title="OneGodian App Dashboard"
        body="Open real OneGodian member, contributor, creator, affiliate, certificate, product, media, learning, registry, tools, and settings modules from one mobile-first gateway."
      />
      <DashboardModules />
    </main>
  );
}
