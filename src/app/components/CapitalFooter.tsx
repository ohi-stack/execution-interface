import Link from 'next/link';
import { additionalCapitalLinks, complianceFooterCopy, primaryCapitalLinks } from './capital-content';

export function CapitalFooter() {
  return (
    <footer className="mt-10 border-t border-gold-300/15 bg-black/55 pb-24 sm:pb-8">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <section>
          <h2 className="text-base font-black text-white">ONEGODIAN CAPITAL PORTAL™</h2>
          <p className="mt-2 text-slate-300">Controlled recordkeeping and capital-documentation interface for ONEGODIAN, LLC.</p>
          <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-400">{complianceFooterCopy}</p>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Capital Portal</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {primaryCapitalLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="hover:text-gold-200">{link.label}</Link></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Support</h2>
          <ul className="mt-3 space-y-2">
            {additionalCapitalLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="hover:text-gold-200">{link.label}</Link></li>
            ))}
          </ul>
        </section>
      </div>
      <div className="border-t border-gold-300/15 px-4 py-4 text-center text-xs leading-5 text-slate-400">© ONEGODIAN, LLC. All rights reserved.</div>
    </footer>
  );
}
