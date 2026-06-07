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
import { ProductionDocPageView } from '@/app/components/production-doc-page';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const page = getProductionDocPage('protocol')!;

export const metadata: Metadata = {
  title: `Protocol | ${productionRelease.name}`,
  description: page.description,
  alternates: { canonical: '/protocol' },
  openGraph: { title: page.title, description: page.description, url: '/protocol', type: 'website' }
};

export default function ProtocolPage() {
  return <ProductionDocPageView page={page} />;
}
