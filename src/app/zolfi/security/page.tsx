import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../../components/CapitalPage';

export const metadata = {
  title: 'Zolfi Security | ONEGODIAN Capital Portal',
  description: 'Zolfi security review for blockchain systems, smart contracts, implementation records, and capital-facing technical workflows.'
};

export default function ZolfiSecurityPage() {
  return (
    <CapitalPage
      eyebrow="ZOLFI • SECURITY"
      title="Blockchain Security Review"
      subtitle="Security-oriented review for blockchain systems, smart contracts, verification workflows, and capital-facing technical records."
      actions={[{ href: '/zolfi', label: 'Back to Zolfi' }, { href: '/zolfi/verification', label: 'Verification Layer' }]}
    >
      <NoticePanel>
        <p>Zolfi security materials are informational readiness and documentation tools. They do not replace independent legal, cybersecurity, audit, financial, tax, or investment review.</p>
      </NoticePanel>
      <CapitalCardGrid>
        <CapitalCard title="Security Scope Mapping"><p>Document contract surfaces, wallet dependencies, registry references, API exposure, admin permissions, and user-facing transaction risks.</p></CapitalCard>
        <CapitalCard title="Risk Reference Notes"><p>Prepare readable risk notes for contributors, internal operators, technical partners, and compliance review before production reliance.</p></CapitalCard>
        <CapitalCard title="QRV Verification Alignment"><p>Connect security documentation to QRV verification and registry references where recordkeeping or proof-layer status is required.</p></CapitalCard>
      </CapitalCardGrid>
    </CapitalPage>
  );
}
