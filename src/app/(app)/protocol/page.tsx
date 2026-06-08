import type { Metadata } from 'next';
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
