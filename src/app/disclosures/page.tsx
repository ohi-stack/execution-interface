import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../components/CapitalPage';

const cards = ['General Disclosure Notice', 'Risk Factors', 'No Guarantee Notice', 'Forward-Looking Statements', 'Private Records Notice', 'Acknowledgement History'];

export default function DisclosuresPage() {
  return (
    <CapitalPage title="Disclosure Center" subtitle="All capital participation requires disclosure review and acknowledgement.">
      <NoticePanel>
        <p>This page provides access to general notices, risk language, participation disclaimers, review requirements, and acknowledgement records.</p>
        <p className="mt-3">Nothing on this page is legal, financial, tax, or investment advice. Participation decisions should be reviewed with qualified advisors where appropriate.</p>
      </NoticePanel>
      <CapitalCardGrid>{cards.map((card) => <CapitalCard key={card} title={card}><p>Disclosure material and acknowledgement recordkeeping for controlled capital workflows.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
