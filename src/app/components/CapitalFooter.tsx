import Link from 'next/link';
import { footerSections } from '@/lib/onegodian-content';

export function CapitalFooter() {
  return <footer className="mt-16 border-t border-slate-800 bg-slate-950/80"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-300 md:grid-cols-3">{footerSections.map((section)=><div key={section.title}><h3 className="mb-3 font-semibold text-slate-100">{section.title}</h3><ul className="space-y-2">{section.links.map((link)=><li key={link.href}>{link.href.startsWith('http') ? <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>}</li>)}</ul></div>)}</div><div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">© 2026 ONEGODIAN™. Designed and written by One Gregory Onegodian™. All Rights Reserved.</div></footer>;
}
