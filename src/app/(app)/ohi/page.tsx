import type { Metadata } from 'next';
import { ProductionDocPageView } from '@/app/components/production-doc-page';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const page = getProductionDocPage('pipeline')!;

export const metadata: Metadata = {
  title: `OHI Pipeline | ${productionRelease.name}`,
  description: page.description,
  alternates: { canonical: '/ohi' },
  openGraph: { title: page.title, description: page.description, url: '/ohi', type: 'website' }
};

export default function OhiPage() {
  return <ProductionDocPageView page={page} />;
}
