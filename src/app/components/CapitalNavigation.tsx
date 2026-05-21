import Link from 'next/link';
import { headers } from 'next/headers';
import { appNavigation, consoleNavigation, ecosystemLinks } from '@/lib/onegodian-content';

export function CapitalNavigation() {
  const host = headers().get('host') ?? '';
  const isConsole = host.startsWith('console.onegodian.com');
  const title = isConsole ? 'OneGodian Console' : 'OneGodian App';
  const nav = isConsole ? consoleNavigation : appNavigation;
  const env = process.env.ONEGODIAN_ENV ?? process.env.NODE_ENV ?? 'dev';

  return <header className="capital-header"><div className="capital-header-inner"><Link href={isConsole ? '/admin' : '/dashboard'} className="capital-logo"><span className="capital-logo-mark">OG</span> {title}</Link>{isConsole ? <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">{env}</span> : null}<nav className="capital-nav" aria-label="Primary">{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><nav className="capital-ecosystem-nav" aria-label="Ecosystem">{ecosystemLinks.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</nav></div></header>;
}
