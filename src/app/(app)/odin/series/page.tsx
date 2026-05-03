import { OdinPageLayout } from '@/components/odin/OdinPageLayout';
import { OdinSeriesGrid } from '@/components/odin/OdinWidgets';

export default function OdinSeriesPage() {
  return <OdinPageLayout title='ODIN Series Index'><OdinSeriesGrid grouped /></OdinPageLayout>;
}
import { OdinSeriesGrid } from '@/components/odin/OdinWidgets';

export default function OdinSeriesPage() { return <main className='min-h-screen px-6 py-10'><div className='mx-auto max-w-6xl'><h1 className='mb-6 text-3xl font-bold'>ODIN Series Index</h1><OdinSeriesGrid grouped /></div></main>; }
