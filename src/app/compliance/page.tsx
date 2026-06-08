import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../components/CapitalPage';

const cards = ['Entity Boundary', 'Offering Boundary', 'Disclosure Boundary', 'Checkout Boundary', 'Certificate Boundary', 'Advisor Review Notice'];

export default function CompliancePage() {
  return (
    <CapitalPage title="Compliance" subtitle="The Capital Portal is designed to support recordkeeping, disclosures, verification, and operational readiness.">
      <NoticePanel>The portal does not independently create securities, approve offerings, solicit investment, guarantee returns, or replace legal, financial, tax, or compliance review.</NoticePanel>
      <CapitalCardGrid>{cards.map((card) => <CapitalCard key={card} title={card}><p>Boundary guidance for controlled capital portal operations and review discipline.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
