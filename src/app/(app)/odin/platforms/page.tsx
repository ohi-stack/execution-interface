import { OdinPageLayout } from '@/components/odin/OdinPageLayout';
import { OdinLayerModel } from '@/components/odin/OdinWidgets';

export default function OdinPlatformsPage() {
  return (
    <OdinPageLayout title='PaaP™ — Planet-as-a-Platform'>
      <OdinLayerModel />
      <section className='rounded-xl border border-slate-700 bg-slate-900/70 p-5 text-slate-200'>
        <p>
          Definition: PaaP™ is the operational platform layer for each world, distinct from canon registry records and commerce execution.
        </p>
        <p className='mt-3'>Standard actions remain View Canon, Enter Planet, and Visit Store.</p>
      </section>
    </OdinPageLayout>
  );
}
