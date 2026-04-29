import OfferingDetail from '@/components/OfferingDetail';
export default function OfferingSlug({ params }: { params: { slug: string } }){return <OfferingDetail id={params.slug} />;}
