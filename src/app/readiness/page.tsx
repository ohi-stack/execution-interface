import { CapitalPage } from '../components/CapitalPage';

const metrics = [
  ['Disclosure Center', 'Needs Review'], ['Certificate Verification', 'In Progress'], ['Contributor Records', 'In Progress'], ['Payment Routing', 'Needs Review'], ['WooCommerce Boundary', 'Documented'], ['Stripe Boundary', 'Pending Review'], ['Legal Review', 'Required'], ['Production Readiness', 'In Progress']
];

export default function ReadinessPage() {
  return (
    <CapitalPage title="Readiness" subtitle="The Readiness page tracks whether the capital portal, disclosures, records, certificate workflows, payment routing, and verification systems are prepared for controlled use.">
      <section className="rounded-3xl border border-gold-300/25 bg-gold-300/10 p-5 leading-7 text-gold-50">Readiness does not mean legal approval. It means the operational system is being prepared, documented, and tested.</section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([name, status]) => <article key={name} className="mobile-card"><h2 className="font-black text-white">{name}</h2><p className="mt-3 status-badge">{status}</p></article>)}</section>
    </CapitalPage>
  );
}
