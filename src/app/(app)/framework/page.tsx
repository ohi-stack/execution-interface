import type { Metadata } from 'next';
import { ProductionDocPageView } from '@/app/components/production-doc-page';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const page = getProductionDocPage('framework')!;

export const metadata: Metadata = {
  title: `Framework | ${productionRelease.name}`,
  description: page.description,
  alternates: { canonical: '/framework' },
  openGraph: {
    title: page.title,
    description: page.description,
    url: '/framework',
    type: 'website'
  }
};

export default function FrameworkPage() {
  return <ProductionDocPageView page={page} />;
}
