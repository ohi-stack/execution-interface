import Link from 'next/link';
import { appFooterBoundary, footerSections } from '@/lib/app-content';

export function CapitalFooter() {
  return (
    <footer className="border-t border-gold-300/15 bg-abyss/86 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-300">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-black tracking-[-0.03em] text-white">OneGodian Production Surface</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-300">Institutional clarity · member access · ecosystem routes</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal" className="hover:text-gold-300">Legal</Link>
            <Link href="/privacy" className="hover:text-gold-300">Privacy</Link>
            <Link href="/terms" className="hover:text-gold-300">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">© 2026 OneGodian</div>
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-300 md:grid-cols-4">
        {footerSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{section.title}</h2>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-cyan-300">{link.label}</a>
                  ) : (
                    <Link href={link.href} className="hover:text-cyan-300">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs leading-5 text-slate-400">{appFooterBoundary}</div>
    </footer>
  );
}
