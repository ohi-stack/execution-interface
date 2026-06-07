'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { additionalCapitalLinks, mobilePrimaryLinks, primaryCapitalLinks } from './capital-content';

const moreLinks = [
  { label: 'Investor Portal', href: '/investor-portal' },
  { label: 'Records', href: '/records' },
  { label: 'Verification', href: '/verification' },
  { label: 'Compliance', href: '/compliance' },
  { label: 'Documents', href: '/documents' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' }
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function CapitalNavigation() {
  const pathname = usePathname() ?? '/';
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreLinks.some((link) => isActive(pathname, link.href));

  return (
    <>
      <header className="capital-header">
        <div className="capital-header-inner">
          <Link href="/" className="capital-logo" aria-label="ONEGODIAN Capital Portal home">
            <span className="capital-logo-mark">OC</span>
            <span>ONEGODIAN CAPITAL PORTAL™</span>
          </Link>
          <nav className="capital-nav" aria-label="Primary capital navigation">
            {primaryCapitalLinks.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? 'is-active' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="capital-ecosystem-nav" aria-label="Additional capital navigation">
            {additionalCapitalLinks.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? 'is-active' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav className="capital-mobile-nav" aria-label="Mobile capital navigation">
        {mobilePrimaryLinks.map((item) => (
          <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? 'is-active' : undefined} onClick={() => setMoreOpen(false)}>
            {item.label}
          </Link>
        ))}
        <button type="button" className={moreActive || moreOpen ? 'is-active' : undefined} aria-expanded={moreOpen} aria-controls="capital-mobile-more" onClick={() => setMoreOpen((open) => !open)}>
          More
        </button>
      </nav>
      {moreOpen ? (
        <div id="capital-mobile-more" className="capital-mobile-more">
          {moreLinks.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? 'is-active' : undefined} onClick={() => setMoreOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </>
  );
}
