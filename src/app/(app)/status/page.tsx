import { CardGrid, InfoCard, OmosPage, StatusPill } from '@/app/components/omos-docs-ui';

const features = [
  ['Global navigation', 'Active', 'Responsive public routes for the documentation node.'],
  ['Documentation pages', 'Active', 'Home, protocol, algorithm, dashboard, API, docs, use cases, roadmap, and status content.'],
  ['POST /api/process public docs', 'Active', 'Canonical documentation path using x-omos-key.'],
  ['Legacy /process runtime concept', 'Active', 'Preserved for compatibility with current runtime integrations.'],
  ['SDK packages', 'Planned', 'Not active until released, documented, and repeatable.'],
  ['Webhook delivery', 'Planned', 'Not active until operational verification exists.'],
  ['Multi-tenant console', 'Planned', 'Future dashboard work; no active claim is made.']
];

export default function StatusPage() {
  return (
    <OmosPage eyebrow="Status" title="Runtime status and feature classification." description="This page states what is active, what is planned, and which version of the node is being documented.">
      <CardGrid cols="lg:grid-cols-3">
        <InfoCard title="Runtime status" accent="green"><StatusPill active>active documentation node</StatusPill><p className="mt-3">Public documentation, route content, and API examples are available.</p></InfoCard>
        <InfoCard title="Version" accent="gold"><p className="font-mono text-cyan-100">0.1.0 documentation-node</p><p className="mt-3">Version follows the package runtime until a dedicated OMOS release marker is configured.</p></InfoCard>
        <InfoCard title="Production rule" accent="cyan"><p>If a feature is not operational, documented, and repeatable, it is planned, not active.</p></InfoCard>
      </CardGrid>
      <section className="overflow-hidden rounded-3xl border border-gold-300/20 bg-black/45">
        <div className="p-5"><h2 className="text-2xl font-black text-white">Live / planned feature table</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-white/[0.05] text-xs uppercase tracking-[0.16em] text-gold-200"><tr><th className="px-5 py-3">Feature</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Notes</th></tr></thead><tbody className="divide-y divide-white/10">{features.map(([feature, status, notes]) => <tr key={feature}><td className="px-5 py-4 font-semibold text-white">{feature}</td><td className="px-5 py-4"><StatusPill active={status === 'Active'}>{status}</StatusPill></td><td className="px-5 py-4 text-slate-300">{notes}</td></tr>)}</tbody></table></div>
      </section>
    </OmosPage>
  );
}
