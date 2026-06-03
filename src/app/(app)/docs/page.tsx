import { CardGrid, InfoCard, OmosPage } from '@/app/components/omos-docs-ui';

const docs = [
  ['Getting started', 'Read the protocol, confirm the compliance boundary, request an API key, then test POST /api/process with a small source payload.'],
  ['Runtime architecture', 'Public pages document the node; API routes expose health, manifest, readiness, stats, and processing; operators verify status before release.'],
  ['Protocol', 'The human, semantic, agent, interface, and compliance layers define how content becomes repeatable system output.'],
  ['Algorithm', 'Observe, Distill, Align, Select, Execute, and Verify provide the runtime model for implementation and review.'],
  ['Auth', 'Use x-omos-key for authenticated endpoints. Store keys server-side and never expose them in browser bundles.'],
  ['Errors', 'Unauthorized, invalid input, plan limit, rate limit, and server errors should include a requestId for operator review.'],
  ['Deployment notes', 'Deploy only documented and repeatable features. Check health, manifest, and status routes after each release.']
];

export default function DocsPage() {
  return (
    <OmosPage eyebrow="Docs" title="Developer and operator documentation." description="This documentation hub explains how OMOS is structured, how to integrate with the runtime, and how to label operational status safely.">
      <CardGrid>{docs.map(([title, detail], i) => <InfoCard key={title} title={title} accent={i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'cyan' : 'green'}><p>{detail}</p></InfoCard>)}</CardGrid>
    </OmosPage>
  );
}
