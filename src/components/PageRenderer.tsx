import Link from 'next/link';
import appPages from '@/data/app-pages.json';
import { DashboardCard } from '@/components/DashboardCard';
import { EcosystemMap } from '@/components/EcosystemMap';
import { RuntimeHealthWidget } from '@/components/RuntimeHealthWidget';

type PagePath = keyof typeof appPages.pages;

type PageRendererProps = {
  path: PagePath;
  showDashboardCards?: boolean;
  showEcosystemMap?: boolean;
  showRuntimeHealth?: boolean;
};

const accents = ['gold', 'cyan', 'purple', 'green'] as const;

export const dashboardModules = appPages.navigation.map((item, index) => ({
  title: item.label === 'OMOS' ? 'OMOS Runtime' : item.label,
  description: item.description,
  href: item.path,
  status: item.label === 'OMOS' ? 'Live sync' : 'Ready',
  accent: accents[index % accents.length]
}));

export function PageRenderer({ path, showDashboardCards = false, showEcosystemMap = false, showRuntimeHealth = false }: PageRendererProps) {
  const page = appPages.pages[path];
  const primaryCta = 'primaryCta' in page ? page.primaryCta : undefined;
  const secondaryCta = 'secondaryCta' in page ? page.secondaryCta : undefined;
  const sections = 'sections' in page && Array.isArray(page.sections) ? page.sections : [];

  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">{page.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,10vw,4.8rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">{page.title}</h1>
          <p className="mt-5 text-xl font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">{page.headline}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{page.body}</p>
        </div>
        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {primaryCta ? <Link href={primaryCta.href} className="premium-button">{primaryCta.label}</Link> : null}
            {secondaryCta ? <Link href={secondaryCta.href} className="premium-button-secondary">{secondaryCta.label}</Link> : null}
            {path === '/' ? <Link href="/omos" className="premium-button-secondary">Connect OMOS</Link> : null}
          </div>
        )}
      </section>

      {showRuntimeHealth ? <RuntimeHealthWidget /> : null}
      {showEcosystemMap ? <EcosystemMap /> : null}

      {showDashboardCards ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardModules.map((module) => <DashboardCard key={module.href} {...module} />)}
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <article key={section} className="mobile-card min-w-0">
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-cyan-100">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-4 text-xl font-black tracking-[-0.02em] text-white">{section}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Structured access for {section.toLowerCase()} within the public/member-facing OneGodian app.</p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
