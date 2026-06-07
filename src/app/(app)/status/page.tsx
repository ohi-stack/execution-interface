import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS System Status',
  description: 'Module readiness grid for the OMOS framework, algorithm, protocol, OHI Pipeline, Belief Mapper Lite, docs, APIs, and plugin bridge.',
  alternates: { canonical: '/status' }
};

export default function StatusPage() {
  return <OmosPageTemplate page={getOmosPage('status')!} />;
}
