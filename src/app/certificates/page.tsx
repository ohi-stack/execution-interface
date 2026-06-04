import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../components/CapitalPage';

const cards = ['Verify Certificate', 'Search Certificate ID', 'Download Record', 'View OBP-1 Reference', 'Certificate Status', 'Issuer Notes'];

export default function CertificatesPage() {
  return (
    <CapitalPage title="Certificates" subtitle="The Certificates section supports document references, certificate records, OBP-1 verification references, QR validation, and downloadable proof-of-record files where applicable.">
      <NoticePanel>Certificates are recordkeeping tools. They do not replace legal review, ownership documentation, offering documents, contracts, or required disclosures.</NoticePanel>
      <CapitalCardGrid>{cards.map((card) => <CapitalCard key={card} title={card}><p>Certificate workflow support for record references, status confirmation, and verification routing.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
