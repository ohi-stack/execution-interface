import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'The OneGodian Algorithm™',
  description: 'Protocol, experience, community, and orientation layers with the Observe, Distill, Align, Select, Execute, Verify sequence.',
  alternates: { canonical: '/algorithm' }
};

export default function AlgorithmPage() {
  return <OmosPageTemplate page={getOmosPage('algorithm')!} />;
}
