import { MembershipBridge, PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function MembersPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Membership" title="OneGodian Membership" body="Membership reflects the merged membership shortcodes for CTA, pricing, resources, member certificates, dashboard access, and member support." />
      <MembershipBridge />
      <PluginBridgeGrid />
    </main>
  );
}
