import Link from 'next/link';
import CapitalImagePanel from './CapitalImagePanel';

type WorkflowPreviewProps = {
  heading: string;
  description: string;
  readinessNotice: string;
  ctaLabel: string;
  ctaHref: string;
  src?: string;
  alt: string;
};

export default function WorkflowPreview(props: WorkflowPreviewProps) {
  return (
    <section className="workflow-preview page-section">
      <CapitalImagePanel title={props.heading} description={props.description} src={props.src} alt={props.alt} badge="Workflow" />
      <p className="notice">{props.readinessNotice}</p>
      <Link href={props.ctaHref}>{props.ctaLabel}</Link>
    </section>
  );
}
