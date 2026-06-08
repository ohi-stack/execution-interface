import type { Metadata } from 'next';
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
