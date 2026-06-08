import type { Metadata } from 'next';
import { ProtocolDocsEngine, getProtocolDocMetadata } from '@/components/docs/ProtocolDocsEngine';
import { protocolDocs } from '@/lib/protocol-docs';

type DocsRouteProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return protocolDocs.map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: DocsRouteProps): Metadata {
  const metadata = getProtocolDocMetadata(params.slug);
  return {
    title: metadata ? `${metadata.title} | OneGodian Docs` : 'OneGodian Docs',
    description: metadata?.description
  };
}

export default function DocsRoutePage({ params }: DocsRouteProps) {
  return <ProtocolDocsEngine slug={params.slug} />;
}
