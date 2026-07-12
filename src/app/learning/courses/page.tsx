import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

export const metadata = { title: 'Learning Courses | OneGodian App' };

export default function Page() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="Learning Academy" title="App-facing course directory" description="Browse course discovery inside the OneGodian App, then continue to the canonical University LMS catalog for enrollment and academic delivery." />
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6">
        <Link href="https://u.onegodian.org/courses" className="inline-flex rounded-full border border-amber-200/50 bg-amber-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">Open canonical LMS catalog</Link>
      </section>
    </main>
  );
}
