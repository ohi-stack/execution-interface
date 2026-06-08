import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../../components/CapitalPage';

export const metadata = {
  title: 'Zolfi Post-Quantum Readiness | ONEGODIAN Capital Portal',
  description: 'Zolfi post-quantum readiness planning for blockchain systems, key management, migration documentation, and verification-aware infrastructure.'
};

export default function ZolfiPostQuantumReadinessPage() {
  return (
    <CapitalPage
      eyebrow="ZOLFI • POST-QUANTUM READINESS"
      title="Post-Quantum Readiness"
      subtitle="Readiness planning for cryptographic resilience, key-management review, migration documentation, and verification-aware security posture."
      actions={[{ href: '/zolfi', label: 'Back to Zolfi' }, { href: '/zolfi/verification', label: 'Verification Layer' }]}
    >
      <NoticePanel>
        <p>Post-quantum readiness materials are planning references only. Implementation decisions require independent technical, cybersecurity, legal, and operational review before reliance.</p>
      </NoticePanel>
      <CapitalCardGrid>
        <CapitalCard title="Cryptographic Inventory"><p>Identify wallets, keys, signatures, contracts, certificate references, APIs, storage systems, and registry dependencies that may require future cryptographic migration.</p></CapitalCard>
        <CapitalCard title="Migration Planning"><p>Prepare staged readiness notes for transition planning, risk documentation, stakeholder review, and controlled deployment sequencing.</p></CapitalCard>
        <CapitalCard title="Verification Continuity"><p>Align future security posture with QRV verification and registry records so proof references remain traceable across infrastructure changes.</p></CapitalCard>
      </CapitalCardGrid>
    </CapitalPage>
  );
}
