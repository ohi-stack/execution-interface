import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS Documentation',
  description: 'OMOS documentation groups for core specifications, developer materials, institutional materials, and version control.',
  alternates: { canonical: '/docs' }
};

export default function DocsPage() {
  return <OmosPageTemplate page={getOmosPage('docs')!} />;
}
