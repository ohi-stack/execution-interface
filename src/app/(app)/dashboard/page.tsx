import { CardGrid, CodeBlock, InfoCard, OmosPage, StatusPill } from '@/app/components/omos-docs-ui';
import { processCurl, processJson } from '@/lib/omos-docs-content';

const endpoints = [
  ['GET /api/health', 'Public health check', 'active'],
  ['GET /api/manifest', 'Public node manifest', 'active'],
  ['GET /api/system-health', 'Runtime readiness snapshot', 'active'],
  ['GET /api/stats', 'Authenticated usage and runtime stats', 'active'],
  ['POST /api/process', 'Authenticated OMOS processing endpoint', 'active'],
  ['POST /process', 'Legacy-compatible process route retained for current integrations', 'active']
];

const plans = [
  ['Starter', 'Documented pilot access for basic summaries and low-volume validation.'],
  ['Operator', 'Expanded operational use for internal documentation and governance workflows.'],
  ['Enterprise', 'Higher-volume integration for repeatable systems, compliance review, and multi-surface publishing.']
];

export default function DashboardPage() {
  return (
    <OmosPage eyebrow="Dashboard" title="Runtime dashboard and API orientation." description="Use this page to identify public endpoints, authenticated routes, plan expectations, and canonical request/response examples.">
      <CardGrid>
        {plans.map(([title, detail]) => <InfoCard key={title} title={title} accent="gold"><p>{detail}</p></InfoCard>)}
      </CardGrid>
      <section className="overflow-hidden rounded-3xl border border-gold-300/20 bg-black/45">
        <div className="p-5"><h2 className="text-2xl font-black text-white">Endpoint list</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.16em] text-gold-200"><tr><th className="px-5 py-3">Endpoint</th><th className="px-5 py-3">Purpose</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {endpoints.map(([endpoint, purpose, status]) => <tr key={endpoint}><td className="px-5 py-4 font-mono text-cyan-100">{endpoint}</td><td className="px-5 py-4 text-slate-300">{purpose}</td><td className="px-5 py-4"><StatusPill active={status === 'active'}>{status}</StatusPill></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Curl example" accent="cyan"><CodeBlock code={processCurl} /></InfoCard>
        <InfoCard title="JSON response example" accent="green"><CodeBlock code={processJson} /></InfoCard>
      </div>
    </OmosPage>
  );
}
