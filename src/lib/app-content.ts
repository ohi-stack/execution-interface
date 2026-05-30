export type AppRoute = {
  label: string;
  href: string;
};

export type DashboardModule = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  status: string;
  accent: 'cyan' | 'gold' | 'violet' | 'emerald' | 'magenta' | 'orange' | 'red' | 'silver';
};

export const appHomeHero = {
  eyebrow: 'APP.ONEGODIAN.COM',
  title: 'Welcome to the OneGodian App',
  description:
    'Unified access to the OneGodian ecosystem, member tools, registries, campaigns, media, learning, certificates, and operational resources.',
  positioning:
    'The OneGodian App is the central access layer for the OneGodian ecosystem. It connects members, campaigns, registries, tools, certificates, media, learning resources, and operational systems into one structured interface.',
  primaryCta: { label: 'Open Dashboard', href: '/dashboard' },
  secondaryCta: { label: 'Open Members', href: '/members' }
};

export const appNavigation: AppRoute[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Members', href: '/members' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Registry', href: '/registry' },
  { label: 'Tools', href: '/tools' },
  { label: 'Media', href: '/media' },
  { label: 'Learning', href: '/learn' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Support', href: '/support' },
  { label: 'Account', href: '/account' },
  { label: 'Settings', href: '/settings' }
];

export const appDashboardCards: DashboardModule[] = [
  {
    title: 'Members',
    description:
      'Access your OneGodian member profile, membership status, digital ID, certificate records, and community tools.',
    href: '/members',
    buttonLabel: 'Open Members',
    status: 'Active',
    accent: 'cyan'
  },
  {
    title: 'Campaigns',
    description:
      'View active OneGodian support campaigns, contribution drives, Remember Campaign materials, and public outreach resources.',
    href: '/campaigns',
    buttonLabel: 'View Campaigns',
    status: 'Active',
    accent: 'gold'
  },
  {
    title: 'Remember Campaign',
    description:
      'Preserve memory, identity, origin, purpose, dignity, unity, and disciplined growth through the OneGodian Remember Campaign.',
    href: '/campaigns/remember',
    buttonLabel: 'Open Remember Campaign',
    status: 'Featured',
    accent: 'violet'
  },
  {
    title: 'Registry',
    description: 'Access ODIN records, verification entries, certificates, archived filings, and system records.',
    href: '/registry',
    buttonLabel: 'Open Registry',
    status: 'Active',
    accent: 'emerald'
  },
  {
    title: 'Tools',
    description: 'Use OneGodian utilities, forms, calculators, onboarding tools, conversion tools, and internal app resources.',
    href: '/tools',
    buttonLabel: 'Open Tools',
    status: 'Active',
    accent: 'orange'
  },
  {
    title: 'Media',
    description: 'Access OneGodian media, videos, music, publications, campaigns, and visual assets.',
    href: '/media',
    buttonLabel: 'Open Media',
    status: 'Active',
    accent: 'magenta'
  },
  {
    title: 'Learning',
    description: 'Enter OneGodian education pathways, courses, onboarding, resources, and certification materials.',
    href: '/learn',
    buttonLabel: 'Start Learning',
    status: 'Connected',
    accent: 'silver'
  },
  {
    title: 'Certificates',
    description:
      'View, request, or verify OneGodian certificates, membership confirmations, campaign certificates, and digital credentials.',
    href: '/certificates',
    buttonLabel: 'Open Certificates',
    status: 'Active',
    accent: 'emerald'
  },
  {
    title: 'Support / Contributions',
    description:
      'Support the continued development of OneGodian infrastructure, publishing, systems, media, and community tools.',
    href: '/support',
    buttonLabel: 'Support OneGodian',
    status: 'Active',
    accent: 'red'
  }
];

export const ecosystemPortals = [
  { name: 'OneGodian.org', role: 'Public explanation, writings, remembrance, and institutional context.', url: 'https://onegodian.org' },
  { name: 'OneGodian.com', role: 'Commerce and identity product engine.', url: 'https://onegodian.com' },
  { name: 'u.OneGodian.com', role: 'Learning pathways, course delivery, and student services.', url: 'https://u.onegodian.com' },
  { name: 'app.OneGodian.com', role: 'Unified ecosystem app for members, dashboards, registries, tools, certificates, media, and campaigns.', url: 'https://app.onegodian.com' },
  { name: 'OMOS.OneGodian.com', role: 'Operating system documentation and protocol structure.', url: 'https://omos.onegodian.com' },
  { name: 'Galaxy OneGodian', role: 'Immersive ecosystem and world navigation layer.', url: 'https://galaxy.onegodian.com' },
  { name: 'QuantumOHI.com', role: 'Advanced systems and intelligence architecture context.', url: 'https://quantumohi.com' },
  { name: 'QRV.Network', role: 'Verification and trust infrastructure.', url: 'https://qrv.network' }
];

export const appFooterBoundary =
  'OneGodian App is the public/member node. Admin and control functions remain in designated console and control panel surfaces.';
