import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsEngine } from '@/components/docs/DocsEngine';
import { docsBySlug, protocolDocs } from '@/data/protocol-docs';

export function generateStaticParams() { return protocolDocs.map((doc) => ({ slug: doc.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = docsBySlug.get(params.slug);
  if (!doc) return { title: 'Protocol Documentation' };
  return { title: doc.title, description: doc.summary };
}

export default function Page({ params }: { params: { slug: string } }) {
  const doc = docsBySlug.get(params.slug);
  if (!doc) notFound();
  return <DocsEngine doc={doc} />;
}
