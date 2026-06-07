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
import { ProductionDocPageView } from '@/app/components/production-doc-page';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const page = getProductionDocPage('algorithm')!;

export const metadata: Metadata = {
  title: `Algorithm | ${productionRelease.name}`,
  description: page.description,
  alternates: { canonical: '/algorithm' },
  openGraph: { title: page.title, description: page.description, url: '/algorithm', type: 'website' }
};

export default function AlgorithmPage() {
  return <ProductionDocPageView page={page} />;
}
