import Link from 'next/link';
import { appNavigation, ecosystemLinks } from '@/lib/onegodian-content';

export function CapitalNavigation() {
  return <header className="capital-header"><div className="capital-header-inner"><Link href="/" className="capital-logo"><span className="capital-logo-mark">OG</span> OneGodian Control Plane</Link><nav className="capital-nav" aria-label="Primary">{appNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><nav className="capital-ecosystem-nav" aria-label="Ecosystem">{ecosystemLinks.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</nav></div></header>;
}
