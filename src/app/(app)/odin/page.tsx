import { OdinCanonNotice, OdinCtaBand, OdinHero, OdinLayerModel, OdinSeriesGrid, OdinStatGrid } from '@/components/odin/OdinWidgets';

export default function OdinPage() {
  return <main className='min-h-screen px-6 py-10'><div className='mx-auto max-w-6xl space-y-6'><OdinHero /><OdinStatGrid /><OdinLayerModel /><OdinSeriesGrid /><OdinCanonNotice /><OdinCtaBand /></div></main>;
import { OdinPageLayout } from '@/components/odin/OdinPageLayout';

export default function OdinPage() {
  return <OdinPageLayout title='ODIN Registry™'><OdinHero /><OdinStatGrid /><OdinLayerModel /><OdinSeriesGrid /><OdinCanonNotice /><OdinCtaBand /></OdinPageLayout>;
}
