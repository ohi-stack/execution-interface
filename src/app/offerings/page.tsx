import Link from 'next/link';
import { CapitalPage } from '../components/CapitalPage';

const offerings = [
  { name: 'ONEGODIAN Capital Documentation Packet', code: 'OGC-DOC-001', status: 'Available for Review', term: 'As documented', rate: 'Not applicable', disclosure: 'Disclosure Required', certificate: 'Available after record acceptance' },
  { name: 'Contributor Record Intake Reference', code: 'OGC-CRI-002', status: 'Internal Review', term: 'Internal workflow', rate: 'Not applicable', disclosure: 'Required before participation', certificate: 'Pending workflow readiness' },
  { name: 'OBP-1 Certificate Reference File', code: 'OBP-1-REF-003', status: 'Draft', term: 'Recordkeeping reference', rate: 'Not applicable', disclosure: 'Review required', certificate: 'Draft template only' },
  { name: 'Platform Participation Materials', code: 'OGC-PPM-004', status: 'Disclosure Required', term: 'Subject to review', rate: 'Not applicable', disclosure: 'Acknowledgement required', certificate: 'Conditional' },
  { name: 'Legacy Review Archive', code: 'OGC-ARC-005', status: 'Archived', term: 'Closed record', rate: 'Not applicable', disclosure: 'Historical record', certificate: 'Unavailable' },
  { name: 'Closed Internal Instrument Record', code: 'OGC-CIR-006', status: 'Closed', term: 'Closed', rate: 'Not applicable', disclosure: 'Completed record', certificate: 'Record only' }
];

export default function OfferingsPage() {
  return (
    <CapitalPage title="Offerings" subtitle="Review available ONEGODIAN capital-related documents, instruments, contribution records, and platform participation materials.">
      <section className="grid gap-4 lg:grid-cols-2">
        {offerings.map((item) => (
          <article key={item.code} className="mobile-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">{item.name}</h2>
                <p className="mt-1 text-sm font-semibold text-gold-200">Reference code: {item.code}</p>
              </div>
              <span className="status-badge">{item.status}</span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
              <div><dt className="font-bold text-white">Term</dt><dd>{item.term}</dd></div>
              <div><dt className="font-bold text-white">Rate</dt><dd>{item.rate}</dd></div>
              <div><dt className="font-bold text-white">Disclosure requirement</dt><dd>{item.disclosure}</dd></div>
              <div><dt className="font-bold text-white">Certificate availability</dt><dd>{item.certificate}</dd></div>
            </dl>
            <Link href="/disclosures" className="premium-button-secondary mt-5">Review Details</Link>
          </article>
        ))}
      </section>
    </CapitalPage>
  );
}
