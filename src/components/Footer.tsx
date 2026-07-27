import Link from 'next/link';
const groups = [
  ['Platform', [['About', '/about'], ['Token', '/token'], ['Utility', '/utility'], ['Ecosystem', '/ecosystem']]],
  ['Resources', [['Developers', '/developers'], ['Documentation', '/docs'], ['Platform status', '/status'], ['Contract', '/contract']]],
  ['Trust', [['Disclosures', '/disclosures'], ['Security', '/security'], ['API manifest', '/api/manifest'], ['Accessibility', '/docs#accessibility']]],
] as const;
export function Footer(){return <footer><div className="footer-grid"><div className="footer-brand"><strong>ODC</strong><p>Canonical public information for OneGodian Digital Coin on Ethereum Mainnet.</p><p>odc.onegodian.com</p></div>{groups.map(([title, links]) => <div key={title}><strong>{title}</strong>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>)}</div><div className="fineprint"><span>© 2026 ONEGODIAN, LLC. All rights reserved.</span><span>ODC provides no custody and makes no guarantee of value or liquidity.</span><Link href="/disclosures">Risk disclosures</Link></div></footer>}
