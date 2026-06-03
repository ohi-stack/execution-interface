import { CardGrid, CodeBlock, InfoCard, OmosPage } from '@/app/components/omos-docs-ui';
import { errorJson, processCurl, processJson } from '@/lib/omos-docs-content';

const endpointClasses = [
  ['Public status', 'Health, version, manifest, and readiness routes for monitoring and discovery.'],
  ['Authenticated processing', 'POST /api/process and compatible legacy /process requests using x-omos-key.'],
  ['Authenticated telemetry', 'Usage and runtime stats for operators with a valid key.'],
  ['Planned extensions', 'Batch processing, webhooks, SDKs, and multi-tenant dashboards remain planned until operational, documented, and repeatable.']
];

export default function ApiPage() {
  return (
    <OmosPage eyebrow="API" title="OMOS API reference." description="The public API documentation normalizes processing integrations to POST /api/process with x-omos-key authentication while retaining the current /process concept for compatibility.">
      <CardGrid cols="lg:grid-cols-4">{endpointClasses.map(([title, detail], i) => <InfoCard key={title} title={title} accent={i === 3 ? 'gold' : 'cyan'}><p>{detail}</p></InfoCard>)}</CardGrid>
      <InfoCard title="Authentication" accent="gold">
        <p>Send the API key in the <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-100">x-omos-key</code> header. Bearer authorization may be supported by runtime compatibility, but public examples use x-omos-key.</p>
        <p className="mt-3"><strong>Base URL:</strong> <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-100">https://omos.onegodian.com</code></p>
      </InfoCard>
      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="Request example"><CodeBlock code={processCurl} /></InfoCard>
        <InfoCard title="Response example" accent="green"><CodeBlock code={processJson} /></InfoCard>
        <InfoCard title="Error example" accent="gold"><CodeBlock code={errorJson} /></InfoCard>
      </div>
    </OmosPage>
  );
}
