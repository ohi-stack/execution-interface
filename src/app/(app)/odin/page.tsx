import { OdinCanonNotice, OdinCtaBand, OdinHero, OdinLayerModel, OdinSeriesGrid, OdinStatGrid } from '@/components/odin/OdinWidgets';
import { OdinPageLayout } from '@/components/odin/OdinPageLayout';

export default function OdinPage() {
  return <OdinPageLayout title='ODIN Registry™'><OdinHero /><OdinStatGrid /><OdinLayerModel /><OdinSeriesGrid /><OdinCanonNotice /><OdinCtaBand /></OdinPageLayout>;
}
