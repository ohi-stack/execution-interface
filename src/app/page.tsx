import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from './components/CapitalPage';

const boundaryCards = [
  ['Public Information Layer', 'Website pages, explanatory content, general education, summaries, and public-facing capital documentation.'],
  ['Commerce / Checkout Layer', 'WooCommerce or Stripe-powered checkout access for approved products, documents, services, or permitted payment flows.'],
  ['Capital Records Layer', 'Contributor records, instrument references, readiness status, document history, and internal recordkeeping.'],
  ['Disclosure Review Layer', 'Disclosure acknowledgement, investor/contributor notices, risk language, required confirmations, and participation gates.'],
  ['Certificate Verification Layer', 'Certificate IDs, OBP-1 references, QR verification, downloadable records, and status confirmation.'],
  ['Compliance Boundary', 'The portal does not independently create, approve, validate, or guarantee any securities offering. All capital participation must be supported by appropriate review, disclosures, documentation, and applicable legal compliance.']
];

export default function HomePage() {
  return (
    <CapitalPage
      title="ONEGODIAN CAPITAL PORTAL™"
      subtitle="Private capital infrastructure for records, disclosures, certificates, contributor intake, and verification."
      actions={[
        { href: '/offerings', label: 'View Offerings' },
        { href: '/disclosures', label: 'Review Disclosures' },
        { href: '/verification', label: 'Verify Certificate' },
        { href: '/readiness', label: 'Check Readiness' }
      ]}
    >
      <NoticePanel>
        <p>The ONEGODIAN Capital Portal is a controlled recordkeeping and capital-documentation interface for ONEGODIAN, LLC. It supports offerings documentation, disclosure review, contributor records, certificate verification, readiness tracking, and capital-related platform workflows.</p>
        <p className="mt-3 font-semibold text-gold-100">It does not independently create, approve, validate, market, or guarantee any securities offering.</p>
      </NoticePanel>
      <section className="glass-panel p-5 sm:p-6">
        <h2 className="text-2xl font-black text-white">Operating Boundary Model</h2>
        <div className="mt-3 space-y-3 leading-7 text-slate-300">
          <p>The ONEGODIAN Capital Portal separates public information, checkout activity, capital records, disclosure review, certificate issuance, and verification into distinct operating layers.</p>
          <p>WordPress and WooCommerce may present public-facing information or checkout access where appropriate. The Capital Portal manages capital records, disclosure status, contributor intake records, certificate references, verification workflows, and readiness documentation.</p>
        </div>
      </section>
      <CapitalCardGrid>
        {boundaryCards.map(([title, detail]) => <CapitalCard key={title} title={title}><p>{detail}</p></CapitalCard>)}
      </CapitalCardGrid>
    </CapitalPage>
  );
}
