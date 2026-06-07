import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'The OneGodian Protocol™',
  description: 'Human, semantic, agent, and interface standards for non-denominational neutrality, respectful interaction, compliance, and safety.',
  alternates: { canonical: '/protocol' }
};

export default function ProtocolPage() {
  return <OmosPageTemplate page={getOmosPage('protocol')!} />;
}
