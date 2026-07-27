'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [['Home', '/'], ['About', '/about'], ['Token', '/token'], ['Utility', '/utility'], ['Ecosystem', '/ecosystem'], ['Developers', '/developers'], ['Documentation', '/docs'], ['Status', '/status']] as const;

export function GlobalNavigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false); document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open]);
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to content</a><div className="nav-wrap"><Link href="/" className="brand" aria-label="ODC home"><span aria-hidden="true">ODC</span><strong>OneGodian Digital Coin<small>Official information portal</small></strong></Link><nav aria-label="Primary navigation">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav><a className="console-link" href="https://etherscan.io/token/0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98" target="_blank" rel="noopener noreferrer">View Contract</a><button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={`${open ? 'Close' : 'Open'} navigation menu`} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? '×' : '☰'}</span><span>Menu</span></button></div>{open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}<a className="button" href="https://etherscan.io/token/0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98" target="_blank" rel="noopener noreferrer">View Contract ↗</a></nav>}</header>;
}
