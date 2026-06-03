'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { omosRoutes } from '@/lib/omos-docs-content';

export function CapitalNavigation() {
  const pathname = usePathname() ?? '/';

  return (
    <header className="capital-header">
      <div className="capital-header-inner">
        <Link href="/" className="capital-logo" aria-label="OMOS home">
          <span className="capital-logo-mark">OM</span>
          <span>OMOS<span className="hidden sm:inline"> Documentation Node</span></span>
        </Link>
        <nav className="capital-nav" aria-label="Primary OMOS navigation">
          {omosRoutes.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? 'is-active' : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
