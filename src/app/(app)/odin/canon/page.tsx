import { OdinCanonNotice } from '@/components/odin/OdinWidgets';
import { OdinPageLayout } from '@/components/odin/OdinPageLayout';

export default function OdinCanonPage() { return <OdinPageLayout title='Canon & Authority'><OdinCanonNotice /></OdinPageLayout>; }
export default function OdinCanonPage() { return <main className='min-h-screen px-6 py-10'><div className='mx-auto max-w-4xl'><OdinCanonNotice /></div></main>; }
