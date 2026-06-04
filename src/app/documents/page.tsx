import { CapitalCard, CapitalCardGrid, CapitalPage } from '../components/CapitalPage';

const docs = ['Public Summaries', 'Disclosure Documents', 'Readiness Materials', 'Certificate Templates', 'Review Files'];

export default function DocumentsPage() {
  return (
    <CapitalPage title="Documents" subtitle="The Documents page provides access to public-facing summaries, disclosure documents, readiness materials, certificate templates, and review files where appropriate.">
      <CapitalCardGrid>{docs.map((doc) => <CapitalCard key={doc} title={doc}><p>Document access and review material category for the Capital Portal.</p></CapitalCard>)}</CapitalCardGrid>
    </CapitalPage>
  );
}
