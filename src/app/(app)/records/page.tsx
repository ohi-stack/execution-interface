import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../../components/CapitalPage';

const records = ['Contributor Records', 'Instrument References', 'Disclosure Acknowledgements', 'Certificate References', 'Payment References', 'Verification Logs'];

export default function RecordsPage() {
  return (
    <CapitalPage title="Records" subtitle="The Records page organizes contributor records, instrument references, disclosure acknowledgements, certificate references, payment references, and verification logs for controlled internal review.">
      <NoticePanel>Private records should require authentication before display.</NoticePanel>
      <CapitalCardGrid>{records.map((record) => <CapitalCard key={record} title={record}><p>Controlled recordkeeping category for authenticated internal review.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
