import Link from 'next/link';

const links = [
  { href: '/offerings', label: 'Offerings', description: 'Offering records and disclosure review workspace.' },
  { href: '/investor-portal', label: 'Investor Portal', description: 'Investor dashboard preview and recordkeeping tools.' },
  { href: '/disclosures', label: 'Disclosures', description: 'Disclosure review queue in test-mode for legal review required.' },
  { href: '/certificates', label: 'Certificates', description: 'Certificate verification and record lookup interfaces.' },
  { href: '/compliance-status', label: 'Compliance Status', description: 'Platform infrastructure status and policy checkpoints.' },
  { href: '/support', label: 'Support', description: 'Operational support and escalation process.' },
];

export default function HomePage() {
  return (
    <main>
      <h1>ONEGODIAN Capital Portal</h1>
      <p>
        This portal provides software infrastructure for offering records, disclosures, investor dashboards,
        ledgers, and certificate verification.
      </p>
      <p>
        Compliance notice: this platform does not itself create, approve, or validate securities offerings.
        Legal review required before any production use.
      </p>
      <div className="grid">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="card">
            <h2>{item.label}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
