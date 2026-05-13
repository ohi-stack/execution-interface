import { requiredEnvVars } from '@/lib/control-plane';

const docs = ['Installation guide', 'Environment variable guide', 'API endpoint documentation', 'Admin usage guide', 'Production checklist', 'Changelog', 'Version history', 'Deployment notes', 'Rollback instructions'];

export default function DocsPage() {
  return <main className="space-y-6 p-6 text-slate-100"><h1 className="text-3xl font-semibold">Control Plane Documentation</h1><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{docs.map((doc)=> <article key={doc} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">{doc}</article>)}</section>
  <section className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-4"><h2 className="font-semibold">Required Environment Variables</h2><ul className="mt-2 list-disc pl-5 text-sm text-cyan-300">{requiredEnvVars.map((item)=><li key={item}>{item}</li>)}</ul></section>
  <section className="rounded-xl border border-amber-500/30 bg-slate-900/60 p-4 text-sm text-slate-300"><p>OneGodian.org is the organization/public identity platform.</p><p>ONEGODIAN, LLC is the private commercial/IP/economic entity.</p><p>OMOS.OneGodian.com is the protocol/specification/alignment documentation platform.</p><p>The app is a control plane and operational dashboard, not a legal filing system.</p><p className="mt-2">Terms, Privacy, IP Notice, and Disclaimer placeholders are maintained here pending legal finalization.</p></section></main>;
}
