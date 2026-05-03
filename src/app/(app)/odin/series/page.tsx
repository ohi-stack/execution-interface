import { OdinPageLayout } from '@/components/odin/OdinPageLayout';
import { OdinSeriesGrid } from '@/components/odin/OdinWidgets';

export default function OdinSeriesPage() {
  return <OdinPageLayout title='ODIN Series Index'><OdinSeriesGrid grouped /></OdinPageLayout>;
}
