import { InfoCard, OmosPage, StatusPill } from '@/app/components/omos-docs-ui';

const phases = [
  ['Phase 1', 'Documentation node', 'Active', 'Navigation, route content, API examples, status rules, footer language, and compliance-safe wording.'],
  ['Phase 2', 'Runtime hardening', 'Planned', 'Expanded validation, richer status snapshots, audit logs, and operator release checklists.'],
  ['Phase 3', 'SDK and workflow layer', 'Planned', 'Client libraries, webhook documentation, batch examples, and repeatable workflow templates.'],
  ['Phase 4', 'Governance dashboard', 'Planned', 'Review queues, versioned policy notes, active/planned evidence, and release attestation records.'],
  ['Phase 5', 'Federated systems node', 'Planned', 'Multi-node synchronization, partner manifests, and cross-surface observability after all prerequisites are repeatable.']
];

export default function RoadmapPage() {
  return (
    <OmosPage eyebrow="Roadmap" title="Phased delivery with planned-by-default discipline." description="The roadmap separates documented active capabilities from future work so readers can trust what is operational today.">
      <section className="space-y-4">
        {phases.map(([phase, title, status, detail]) => (
          <InfoCard key={phase} title={`${phase}: ${title}`} accent={status === 'Active' ? 'green' : 'gold'}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><p>{detail}</p><StatusPill active={status === 'Active'}>{status}</StatusPill></div>
          </InfoCard>
        ))}
      </section>
    </OmosPage>
  );
}
