import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OHI Output Pipeline',
  description: 'Source Prompt, Council of Models, Comparison, GCD Distillation, Synthesis, and OMOS Normalization.',
  alternates: { canonical: '/ohi-pipeline' }
};

export default function OhiPipelinePage() {
  return <OmosPageTemplate page={getOmosPage('ohi-pipeline')!} />;
}
