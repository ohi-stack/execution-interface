import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/use-cases', label: 'Use Cases' }
];

export function CapitalNavigation() {
  return (
    <header className="capital-header">
      <div className="capital-header-inner">
        <Link href="/" className="capital-logo">
          <span className="capital-logo-mark">OG</span> OneGodian
        </Link>
        <nav className="capital-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
