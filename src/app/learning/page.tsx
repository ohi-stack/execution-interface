import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

const lmsBaseUrl = 'https://u.onegodian.org';

const schools = [
  'School of OneGodian Foundations',
  'School of Metaphysical Operating Systems',
  'School of Creator, Contributor, and Affiliate Development',
  'School of Certificates, Protocols, and Applied Practice'
];

const featuredCourses = [
  { title: 'OneGodian Foundations', status: 'Open enrollment', href: `${lmsBaseUrl}/courses` },
  { title: 'OMOS Protocol Orientation', status: 'Current cohort', href: `${lmsBaseUrl}/courses` },
  { title: 'Contributor Readiness Pathway', status: 'Featured pathway', href: `${lmsBaseUrl}/courses` }
];

const appLinks = [
  { label: 'Course directory', href: '/learning/courses' },
  { label: 'My courses', href: '/learning/my-courses' },
  { label: 'Progress', href: '/learning/progress' },
  { label: 'Certificates', href: '/learning/certificates' }
];

const lmsLinks = [
  { label: 'Canonical course catalog', href: `${lmsBaseUrl}/courses` },
  { label: 'Student dashboard', href: `${lmsBaseUrl}/dashboard` },
  { label: 'Live classes', href: `${lmsBaseUrl}/live-classes` },
  { label: 'Register for the LMS', href: `${lmsBaseUrl}/register` }
];

export const metadata = {
  title: 'Learning Academy | OneGodian App',
  description: 'Learning Academy overview for University of OneGodian pathways, courses, certificates, enrollment status, and LMS access.'
};

export default function Page() {
  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Learning Academy"
        title="University of OneGodian learning hub"
        description="Use this OneGodian App entry point to review schools, featured courses, progress, certificates, and enrollment status before continuing into the canonical University LMS."
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">University introduction</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">One Academy. Canonical LMS delivery.</h2>
          <p className="mt-4 leading-8 text-slate-300">
            The Learning Academy organizes University of OneGodian discovery inside the OneGodian App, while academic delivery, course access,
            live classes, certificates, login, and registration remain canonical on the University LMS domain.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {lmsLinks.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-amber-200/50 bg-amber-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-100">
                {link.label}
              </Link>
            ))}
          </div>
        </article>

        <aside className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.08] p-6 shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Signed-in status</p>
          <h2 className="mt-3 text-2xl font-black text-white">Learner snapshot</h2>
          <dl className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex justify-between gap-4"><dt>Session state</dt><dd className="font-black text-white">Guest preview / member-ready</dd></div>
            <div className="flex justify-between gap-4"><dt>WooCommerce enrollment</dt><dd className="font-black text-amber-100">Connects after sign-in</dd></div>
            <div className="flex justify-between gap-4"><dt>Active pathways</dt><dd className="font-black text-white">0 previewed</dd></div>
            <div className="flex justify-between gap-4"><dt>Certificates</dt><dd className="font-black text-white">Summary available</dd></div>
          </dl>
          <Link href={`${lmsBaseUrl}/login`} className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:border-amber-200/60 hover:text-amber-100">
            Sign in to LMS
          </Link>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {appLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/45 hover:bg-white/[0.08]">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">App route</span>
            <span className="mt-3 block text-xl font-black">{link.label}</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 lg:col-span-1">
          <h2 className="text-2xl font-black text-white">School directory</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            {schools.map((school) => <li key={school} className="rounded-2xl border border-white/10 bg-black/15 p-4">{school}</li>)}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 lg:col-span-2">
          <h2 className="text-2xl font-black text-white">Featured and current courses</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredCourses.map((course) => (
              <Link key={course.title} href={course.href} className="rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-amber-200/60">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">{course.status}</span>
                <span className="mt-3 block text-lg font-black text-white">{course.title}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
          <h2 className="text-xl font-black text-white">Continue Learning</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Signed-in learners can resume active courses from the LMS dashboard and return here for app-level navigation.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
          <h2 className="text-xl font-black text-white">Certificate pathways</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Certificate summaries appear in the app, with official records and academic completion flows maintained by the LMS.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
          <h2 className="text-xl font-black text-white">Progress and achievements</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Progress cards summarize learner movement across schools, enrollments, live classes, and certificate milestones.</p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-amber-200/20 bg-amber-200/[0.08] p-6">
        <h2 className="text-2xl font-black text-white">Canonical University LMS routes</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {lmsLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-amber-200/40 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-amber-100 transition hover:bg-amber-200 hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
