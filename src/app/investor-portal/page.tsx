import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../components/CapitalPage';

const cards = ['Contributor Profile', 'Disclosure Acknowledgements', 'Instrument Records', 'Certificate References', 'Payment / Checkout History', 'Verification History', 'Support Requests'];

export default function InvestorPortalPage() {
  return (
    <CapitalPage title="Investor Portal" subtitle="The Investor Portal is used to review contributor records, disclosure status, certificate references, verification history, and document access.">
      <NoticePanel>Access should require authentication before showing private records.</NoticePanel>
      <CapitalCardGrid>{cards.map((card) => <CapitalCard key={card} title={card}><p>Authenticated capital portal workspace for controlled review and record access.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
