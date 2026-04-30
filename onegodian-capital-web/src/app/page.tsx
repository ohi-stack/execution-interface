import Link from 'next/link';
import CapitalImagePanel from '@/components/CapitalImagePanel';
import WorkflowPreview from '@/components/WorkflowPreview';

export default function HomePage() {
  return (
    <main>
      <h1>ONEGODIAN Capital Portal</h1>
      <div className="capital-image-grid">
        <CapitalImagePanel title="Capital Portal Hero" description="Office mockup visual for portal presentation context." alt="Visual mockup of the capital portal office interface for design preview only." />
        <CapitalImagePanel title="Portal Dashboard Preview" description="Dashboard layout preview for records and operations." alt="Capital dashboard user interface preview with sample modules and record cards." href="/investor-portal" />
        <CapitalImagePanel title="Operating Boundary Diagram" description="Layered architecture boundaries for platform operations." alt="Operating boundary diagram showing presentation, checkout, and recordkeeping layers." href="/operating-boundary" />
      </div>
      <WorkflowPreview heading="Certificate Workflow Preview" description="Certificate issuance and verification sequence for review." readinessNotice="Production readiness requires legal approval and control validation." ctaLabel="Review Certificates" ctaHref="/certificates" alt="Certificate workflow diagram showing issuance and validation checkpoints." />
      <WorkflowPreview heading="Disclosure Workflow Preview" description="Disclosure intake and acknowledgement sequence." readinessNotice="Disclosure text and acknowledgement flow require qualified legal review." ctaLabel="Review Disclosures" ctaHref="/disclosures" alt="Disclosure workflow diagram showing packet checks and acknowledgement path." />
      <p><Link href="/resources">Visual guides and references</Link></p>
    </main>
  );
}
