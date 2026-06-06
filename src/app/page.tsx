import Link from 'next/link';

type LinkCard = {
  title: string;
  description?: string;
  href: string;
  cta?: string;
};

type PathwayCard = LinkCard & {
  subtitle: string;
  items: string[];
};

const platformCards: LinkCard[] = [
  {
    title: 'Onegodian.org',
    description: 'Public home for identity, belief, community, education, historical record, and interpretive clarity.',
    href: 'https://onegodian.org',
    cta: 'Open Onegodian.org'
  },
  {
    title: 'Onegodian.com',
    description: 'Commercial store for products, services, digital downloads, books, certificates, branded goods, and business offerings.',
    href: 'https://onegodian.com',
    cta: 'Open Store'
  },
  {
    title: 'u.Onegodian.org',
    description: 'Education portal for courses, learning paths, Onegodianese™, curriculum, certification, and student progress.',
    href: 'https://u.onegodian.org',
    cta: 'Open Learning Portal'
  },
  {
    title: 'app.OneGodian.com',
    description: 'Operational dashboard layer for registries, identity tools, verification, systems, media, platform navigation, and connected infrastructure.',
    href: '/',
    cta: 'Open App Dashboard'
  }
];

const identityBridgeCards: LinkCard[] = [
  {
    title: 'Identity & Meaning',
    description: 'Learn the meaning of ONEGODIAN™, the identity framework, and key definitions.',
    href: 'https://onegodian.org/about'
  },
  {
    title: 'Membership Pathway',
    description: 'Explore member education, community participation, and structured access.',
    href: 'https://onegodian.org/membership'
  },
  {
    title: 'Historical Record',
    description: 'Review origin, authorship, records, timeline, and institutional continuity.',
    href: 'https://onegodian.org/history'
  },
  {
    title: 'OneGodian Sciences™',
    description: 'Conceptual and educational materials related to OneGodian thought, systems, and research.',
    href: 'https://onegodian.org/onegodian-science'
  }
];

const memberToolCards: LinkCard[] = [
  {
    title: 'Member Identity',
    description: 'Access member profile information, identity explanations, status, and participation records.',
    href: '/identity'
  },
  {
    title: 'Member Education',
    description: 'Connect to guided materials, learning paths, courses, and Onegodianese™ resources.',
    href: '/learn'
  },
  {
    title: 'Certificates & Records',
    description: 'View certificate tools, record references, verification pathways, and document lookup.',
    href: '/verification'
  },
  {
    title: 'Member Dashboard',
    description: 'Use the dashboard as the central place for updates, tools, profile access, and member-only actions.',
    href: '/dashboard'
  }
];

const storeCards: LinkCard[] = [
  { title: 'Digital Downloads', href: 'https://onegodian.com/product-category/digital-downloads' },
  { title: 'Books & Guides', href: 'https://onegodian.com/product-category/books-guides' },
  { title: 'Membership Resources', href: 'https://onegodian.com/product-category/membership-resources' },
  { title: 'Certificates', href: 'https://onegodian.com/product-category/certificates' },
  { title: 'Apparel & Goods', href: 'https://onegodian.com/product-category/apparel-goods' },
  { title: 'Services', href: 'https://onegodian.com/product-category/services' }
];

const pathwayCards: PathwayCard[] = [
  {
    title: 'Learn',
    subtitle: 'Identity + Meaning',
    items: ['Definition of OneGodian', 'Core concepts', 'Public explanation pages', 'Frequently asked questions'],
    href: 'https://onegodian.org/about',
    cta: 'Start Learning'
  },
  {
    title: 'Participate',
    subtitle: 'Membership + Community',
    items: ['Membership overview', 'Community pathway', 'Internal guidance', 'Participation structure'],
    href: 'https://onegodian.org/membership',
    cta: 'Explore Membership'
  },
  {
    title: 'Study',
    subtitle: 'History + Research',
    items: ['Historical record', 'Foundational writings', 'Scientific and conceptual pages', 'Timeline and archive'],
    href: 'https://onegodian.org/history',
    cta: 'View Archive'
  },
  {
    title: 'Build',
    subtitle: 'App + Systems',
    items: ['ODIN registry', 'Planetary canon', 'Verification tools', 'Connected platform infrastructure'],
    href: '/odin',
    cta: 'Open ODIN'
  }
];

const accessCards: LinkCard[] = [
  { title: 'Open App Dashboard', href: '/' },
  { title: 'Learning Portal', href: 'https://u.onegodian.org/dashboard' },
  { title: 'Storefront', href: 'https://onegodian.com' },
  { title: 'ODIN Registry', href: '/odin' },
  { title: 'Planetary Registry', href: '/odin/planetary-registry' },
  { title: 'Identity Tools', href: '/identity' },
  { title: 'Verification Tools', href: '/verification' },
  { title: 'Media Center', href: '/media' },
  { title: 'Capital Access', href: '/capital' },
  { title: 'OneGodian Time', href: '/time' }
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">OneGodian ecosystem</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-slate-300">{description}</p> : null}
    </div>
  );
}

function CardGrid({ cards, compact = false }: { cards: LinkCard[]; compact?: boolean }) {
  return (
    <div className={`mt-5 grid gap-4 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
      {cards.map((card) => (
        <Link key={`${card.title}-${card.href}`} href={card.href} className="mobile-card group block min-h-full">
          <h3 className="text-xl font-black tracking-[-0.02em] text-white">{card.title}</h3>
          {card.description ? <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p> : null}
          <span className="mt-5 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 transition group-hover:border-gold-300/60 group-hover:text-gold-100">
            {card.cta ?? 'Open'} →
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="space-y-8 sm:space-y-10">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300 sm:tracking-[0.3em]">ONEGODIAN APP · APP.ONEGODIAN.COM</p>
          <h1 className="mt-4 text-[clamp(2.5rem,11vw,5.6rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">OneGodian Everything App</h1>
          <p className="mt-5 max-w-4xl text-lg font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">
            The central Node/Next.js interface for the OneGodian ecosystem: ODIN registry systems, planetary canon, moon systems, products, certificates, media tools, identity access, education bridges, verification, and synchronized platform infrastructure.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/" className="premium-button">Open Dashboard</Link>
          <Link href="/ecosystem" className="premium-button-secondary">Explore Ecosystem</Link>
          <Link href="/odin" className="premium-button-secondary">Open ODIN Registry</Link>
          <Link href="https://u.onegodian.org/dashboard" className="premium-button-secondary">Student Portal</Link>
        </div>
      </section>

      <section className="mobile-card">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Platform Role</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">What This App Does</h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-slate-300">
          app.OneGodian.com serves as the operational access layer for OneGodian tools, dashboards, registries, identity resources, media modules, certificates, platform bridges, and system interfaces. It connects public explanation, commerce, education, and infrastructure without replacing those dedicated domains.
        </p>
      </section>

      <section>
        <SectionHeader title="Platform Separation" />
        <CardGrid cards={platformCards} />
      </section>

      <section>
        <SectionHeader
          title="Identity · Belief · Community · Education"
          description="Onegodian.org explains the meaning of OneGodian, preserves its public record, supports educational guidance, and provides a structured pathway for people to learn, reflect, and participate with clarity."
        />
        <CardGrid cards={identityBridgeCards} />
      </section>

      <section>
        <SectionHeader
          title="Member Tools"
          description="Member tools provide structured access to identity resources, educational materials, certificates, community updates, and guided participation within the OneGodian framework."
        />
        <CardGrid cards={memberToolCards} />
      </section>

      <section>
        <SectionHeader
          title="Onegodian.com Store Bridge"
          description="Onegodian.com is the commercial store for OneGodian products, services, digital downloads, educational materials, branded goods, member resources, and business offerings."
        />
        <CardGrid cards={storeCards} compact />
        <p className="mt-4 rounded-2xl border border-gold-300/25 bg-gold-300/10 p-4 text-sm leading-6 text-gold-100">
          Simple separation: Onegodian.org explains the framework. Onegodian.com powers the store, products, services, and commercial access. app.OneGodian.com connects users to tools, dashboards, and platform infrastructure.
        </p>
      </section>

      <section>
        <SectionHeader title="Start with the Right Path" />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pathwayCards.map((card) => (
            <Link key={card.title} href={card.href} className="mobile-card group block">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{card.subtitle}</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">{card.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                {card.items.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <span className="mt-5 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 transition group-hover:border-gold-300/60 group-hover:text-gold-100">
                {card.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Live Platform Access" />
        <CardGrid cards={accessCards} compact />
      </section>

      <section className="glass-panel p-5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Public Clarification</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Public Clarification</h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-slate-300">
          Onegodian.org presents an identity, educational, philosophical, and community framework. app.OneGodian.com provides operational access to platform tools, dashboards, registries, and system interfaces. Commercial products and services are handled separately through Onegodian.com and related commercial platforms. Nothing on this app should be read as a claim of nation-state authority, governmental status, or exemption from applicable law.
        </p>
      </section>
    </main>
  );
}
