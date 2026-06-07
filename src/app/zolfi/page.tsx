import { CapitalCard, CapitalCardGrid, CapitalPage, NoticePanel } from '../components/CapitalPage';
import { zolfiProduct } from '../components/capital-products';

export const metadata = {
  title: 'Zolfi | ONEGODIAN Capital Portal',
  description: 'Zolfi is the ONEGODIAN Capital product line for blockchain security, smart contract intelligence, and post-quantum readiness.'
};

export default function ZolfiPage() {
  return (
    <CapitalPage
      eyebrow="ONEGODIAN CAPITAL PRODUCT LINE"
      title="Zolfi"
      subtitle={zolfiProduct.tagline}
      actions={[
        { href: '/zolfi/security', label: 'Security Review' },
        { href: '/zolfi/smart-contracts', label: 'Smart Contracts' },
        { href: '/zolfi/post-quantum-readiness', label: 'Post-Quantum Readiness' },
        { href: '/zolfi/verification', label: 'Verification Layer' }
      ]}
    >
      <NoticePanel>
        <p>{zolfiProduct.positioning}</p>
        <p className="mt-3 font-semibold text-gold-100">Zolfi is not presented as a standalone public destination. It is a ONEGODIAN Capital product line powered by QRV Network infrastructure for verification, registry, API, developer documentation, and monitoring support.</p>
      </NoticePanel>
      <CapitalCardGrid>
        <CapitalCard title="Blockchain Security">
          <p>Security-oriented review for blockchain systems, contracts, records, and implementation pathways before they are used in production or capital-facing workflows.</p>
        </CapitalCard>
        <CapitalCard title="Smart Contract Intelligence">
          <p>Structured smart contract review, documentation, readiness notes, risk references, and verification-aware summaries for technical and institutional stakeholders.</p>
        </CapitalCard>
        <CapitalCard title="Post-Quantum Readiness">
          <p>Readiness positioning for cryptographic resilience, key-management review, migration planning, and future-facing security documentation.</p>
        </CapitalCard>
      </CapitalCardGrid>
      <section className="glass-panel p-5 sm:p-6">
        <h2 className="text-2xl font-black text-white">QRV Network Infrastructure</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {zolfiProduct.qrvInfrastructure.map((item) => (
            <article key={item.href} className="rounded-2xl border border-gold-300/15 bg-white/5 p-4">
              <h3 className="font-black text-white">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.purpose}</p>
              <p className="mt-2 break-all text-xs font-semibold text-gold-200">{item.href}</p>
            </article>
          ))}
        </div>
      </section>
    </CapitalPage>
  );
}
