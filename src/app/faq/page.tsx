import { CapitalPage } from '../components/CapitalPage';

const faqs = [
  ['What is the ONEGODIAN Capital Portal?', 'It is a controlled recordkeeping, disclosure, certificate, verification, contributor intake, and readiness interface for ONEGODIAN, LLC.'],
  ['Does this portal create a securities offering?', 'No. The portal does not independently create, approve, validate, market, or guarantee any securities offering.'],
  ['Are certificates proof of investment ownership?', 'Certificates are recordkeeping tools and do not replace executed agreements, ownership documentation, offering documents, contracts, or required disclosures.'],
  ['What does readiness mean?', 'Readiness means operational systems are being prepared, documented, and tested; it does not mean legal approval.'],
  ['Why are disclosures required?', 'Disclosures help ensure notices, risks, disclaimers, confirmations, and participation gates are reviewed and acknowledged where appropriate.'],
  ['What is the difference between WordPress, WooCommerce, and the Capital Portal?', 'WordPress may present public information, WooCommerce may support permitted checkout access, and the Capital Portal manages records, disclosures, certificates, verification, and readiness documentation.']
];

export default function FAQPage() {
  return (
    <CapitalPage title="FAQ">
      <section className="space-y-4">{faqs.map(([question, answer]) => <article key={question} className="mobile-card"><h2 className="text-xl font-black text-white">{question}</h2><p className="mt-3 leading-7 text-slate-300">{answer}</p></article>)}</section>
    </CapitalPage>
  );
}
