import Link from 'next/link';

const primaryLinks = [
  ['Home', '/'],
  ['Offerings', '/offerings'],
  ['Investor Portal', '/investor-portal'],
  ['Disclosures', '/disclosures'],
  ['Certificates', '/certificates'],
  ['Readiness', '/production-readiness']
];

const ecosystemLinks = [
  ['OneGodian.com', 'https://onegodian.com'],
  ['OneGodian.org', 'https://onegodian.org'],
  ['app.OneGodian.com', 'https://app.onegodian.com'],
  ['QRV.network', 'https://qrv.network']
];

export function CapitalNavigation() {
  return (
    <header className="capital-header">
      <div className="capital-header-inner">
        <Link href="/" className="capital-logo"><span className="capital-logo-mark">OG</span> Capital Portal</Link>
        <nav className="capital-nav" aria-label="Primary">
          {primaryLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <nav className="capital-ecosystem-nav" aria-label="Ecosystem">
          {ecosystemLinks.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
