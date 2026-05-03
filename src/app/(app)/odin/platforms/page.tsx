import { OdinPageLayout } from '@/components/odin/OdinPageLayout';
import { OdinLayerModel } from '@/components/odin/OdinWidgets';

export default function OdinPlatformsPage() {
  return <main className='min-h-screen px-6 py-10'><div className='mx-auto max-w-4xl space-y-4'><OdinLayerModel /><p className='text-slate-300'>Standard buttons across ODIN-PR records: View Canon, Enter Planet, Visit Store.</p></div></main>;
  return (
    <OdinPageLayout title='PaaP™ — Planet-as-a-Platform'>
      <OdinLayerModel />
      <p className='text-slate-300'>Definition: PaaP™ is the operational platform layer for each world. Standard actions remain View Canon, Enter Planet, and Visit Store.</p>
    </OdinPageLayout>
  );
}
