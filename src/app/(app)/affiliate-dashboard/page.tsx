import { AffiliateDashboardContent, PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function AffiliateDashboardPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Affiliate Dashboard" title="Affiliate Dashboard" body="A real app-side structure for referral links, campaign assets, contributor products, creator updates, compliance notices, and application status." />
      <AffiliateDashboardContent />
      <PluginBridgeGrid />
    </main>
  );
}
