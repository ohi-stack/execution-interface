import Link from 'next/link';
const routes=['/architecture/ohi','/architecture/runtime','/architecture/interfaces','/architecture/infrastructure','/architecture/omos-sync'];
export default function Page(){return <main className="space-y-4"><h1 className="text-3xl font-bold">Architecture</h1><p>Public/member-facing app node architecture and OMOS sync boundaries.</p><ul className="list-disc pl-5">{routes.map((r)=><li key={r}><Link className="text-cyan-300" href={r}>{r}</Link></li>)}</ul></main>}
