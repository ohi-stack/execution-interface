import Link from 'next/link';
import { complianceSafeWording, omosRoutes, productionRule } from '@/lib/omos-docs-content';

export function CapitalFooter() {
  return (
    <footer className="mt-10 border-t border-gold-300/15 bg-black/55">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <section>
          <h2 className="text-base font-black text-white">OMOS™ — OneGodian Metaphysical Operating System™</h2>
          <p className="mt-2 text-slate-300">A ONEGODIAN, LLC systems architecture node.</p>
          <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-400">{complianceSafeWording}</p>
          <p className="mt-2 max-w-3xl text-xs font-semibold leading-5 text-gold-100">{productionRule}</p>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Documentation</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {omosRoutes.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-cyan-200">{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Runtime</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/api" className="hover:text-cyan-200">POST /api/process</Link></li>
            <li><Link href="/status" className="hover:text-cyan-200">Runtime status</Link></li>
            <li><Link href="/roadmap" className="hover:text-cyan-200">Planned features</Link></li>
          </ul>
        </section>
      </div>
      <div className="border-t border-gold-300/15 px-4 py-4 text-center text-xs leading-5 text-slate-400">
        © ONEGODIAN, LLC. All rights reserved.
      </div>
    </footer>
  );
}
