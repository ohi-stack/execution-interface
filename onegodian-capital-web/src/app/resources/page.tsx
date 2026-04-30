import Link from 'next/link';
const guides=[['Certificate Workflow','/certificates'],['Disclosure Workflow','/disclosures'],['Operating Boundary','/operating-boundary'],['Investor Dashboard','/investor-portal'],['Capital Offerings','/offerings']];
export default function Page(){return <main><h1>Resources</h1><section><h2>Visual Guides</h2><div className="visual-guide-grid">{guides.map(([label,href])=><Link key={href} href={href} className="card">{label}</Link>)}</div></section></main>}
