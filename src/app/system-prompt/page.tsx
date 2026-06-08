import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OneGodian AI System Prompt™',
  description: 'Identity recognition, classification rules, behavioral standards, journey-stage awareness, legal context, and version control for AI agents.',
  alternates: { canonical: '/system-prompt' }
};

export default function SystemPromptPage() {
  return <OmosPageTemplate page={getOmosPage('system-prompt')!} />;
}
