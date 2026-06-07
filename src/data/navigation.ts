export type NavigationItem = {
  label: string;
  href: string;
};

export const navigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Algorithm', href: '/algorithm' },
  { label: 'Protocol', href: '/protocol' },
  { label: 'OHI Pipeline', href: '/ohi-pipeline' },
  { label: 'Belief Mapper', href: '/belief-mapper' },
  { label: 'System Prompt', href: '/system-prompt' },
  { label: 'Implementation', href: '/implementation' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Status', href: '/status' }
];

export const primaryCta = {
  label: 'Open App',
  href: 'https://app.onegodian.com/omos'
};
