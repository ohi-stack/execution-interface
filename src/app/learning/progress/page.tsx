import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

export const metadata = { title: 'Learning Progress | OneGodian App' };

export default function Page() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="Learning Academy" title="Progress and achievements" description="Track learner progress summaries in the app while official academic progress remains managed by the University LMS." />
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6">
        <Link href="https://u.onegodian.org/dashboard" className="inline-flex rounded-full border border-amber-200/50 bg-amber-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">Review LMS progress</Link>
      </section>
    </main>
  );
}
