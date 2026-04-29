import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function OfferingCard({ slug, title, status }: { slug: string; title: string; status: 'active' | 'pending' | 'review' | 'archived' }) {
  return <Link href={`/offerings/${slug}`} className="block rounded-lg border bg-white p-4 shadow-sm"><div className="mb-2"><StatusBadge status={status} /></div><h3 className="font-semibold">{title}</h3><p className="text-sm text-slate-600">Configurable terms and disclosures</p></Link>;
}
