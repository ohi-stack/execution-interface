import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS Framework',
  description: 'The five core OMOS layers: OneGodian Algorithm™, OHI™ Synthesis Layer, Identity & Belief Mapper, Institutional & Legal Layer, and Protocol & System Prompt Layer.',
  alternates: { canonical: '/framework' }
};

export default function FrameworkPage() {
  return <OmosPageTemplate page={getOmosPage('framework')!} />;
}
