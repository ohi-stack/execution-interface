import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../../components/CapitalPage';

export const metadata = {
  title: 'Zolfi Smart Contracts | ONEGODIAN Capital Portal',
  description: 'Zolfi smart contract intelligence for review, documentation, readiness, and verification-aware capital workflows.'
};

export default function ZolfiSmartContractsPage() {
  return (
    <CapitalPage
      eyebrow="ZOLFI • SMART CONTRACTS"
      title="Smart Contract Intelligence"
      subtitle="Structured smart contract review, documentation, readiness mapping, and verification-aware reporting for ONEGODIAN Capital workflows."
      actions={[{ href: '/zolfi', label: 'Back to Zolfi' }, { href: '/zolfi/security', label: 'Security Review' }]}
    >
      <NoticePanel>
        <p>Zolfi smart contract intelligence supports internal review, documentation, and readiness planning. It is not a legal opinion, audit certification, investment approval, or guarantee of contract performance.</p>
      </NoticePanel>
      <CapitalCardGrid>
        <CapitalCard title="Contract Surface Review"><p>Identify functions, permissions, admin controls, token or asset references, user-facing actions, and recordkeeping dependencies.</p></CapitalCard>
        <CapitalCard title="Documentation Intelligence"><p>Convert technical contract behavior into readable summaries, readiness notes, disclosure references, and implementation checklists.</p></CapitalCard>
        <CapitalCard title="Verification-Aware Records"><p>Prepare contract references for QRV verification, registry alignment, certificate status, and controlled capital-documentation workflows.</p></CapitalCard>
      </CapitalCardGrid>
    </CapitalPage>
  );
}
