import type { Metadata } from 'next';
import { ProductionDocPageView } from '@/app/components/production-doc-page';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const page = getProductionDocPage('pipeline')!;

export const metadata: Metadata = {
  title: `OHI Pipeline | ${productionRelease.name}`,
  description: page.description,
  alternates: { canonical: '/pipeline' },
  openGraph: { title: page.title, description: page.description, url: '/pipeline', type: 'website' }
};

export default function PipelinePage() {
  return <ProductionDocPageView page={page} />;
}
