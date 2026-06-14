import type { Metadata } from 'next';
import { OneGodianCalendar } from '@/components/OneGodianCalendar';

export const metadata: Metadata = {
  title: 'OneGodian Calendar',
  description: 'OTS-V5 calendar reference with epoch-based day order labels.'
};

export default function Page() {
  return (
    <main className="space-y-8">
      <h1 className="text-5xl font-black text-white">OneGodian Calendar</h1>
      <OneGodianCalendar />
    </main>
  );
}
