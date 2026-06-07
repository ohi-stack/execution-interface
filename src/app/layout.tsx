import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { productionRelease } from '@/lib/production-docs';

export const metadata: Metadata = {
  metadataBase: new URL('https://omos.onegodian.com'),
  title: {
    default: 'OMOS.OneGodian.com | OneGodian Metaphysical Operating System™',
    template: '%s | OMOS.OneGodian.com'
  },
  description: 'The systems-architecture and protocol platform for the OneGodian Metaphysical Operating System™, OneGodian Algorithm™, OneGodian Protocol™, OHI Pipeline, Belief Mapper, and AI standards.',
  openGraph: {
    title: 'The OneGodian Metaphysical Operating System™',
    description: 'Operational intelligence, protocol architecture, alignment systems, and AI-era implementation standards for the OneGodian ecosystem.',
    url: 'https://omos.onegodian.com',
    siteName: 'OMOS.OneGodian.com',
    type: 'website'
  },
  alternates: { canonical: '/' }
  metadataBase: new URL(productionRelease.canonicalHost),
  title: {
    default: 'The OneGodian App',
    template: '%s | The OneGodian App'
  },
  description: 'Unified access for identity, systems, records, education, commerce, media, verification, and OMOS Production Documentation Release 1.0.',
  applicationName: 'The OneGodian App',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'The OneGodian App',
    description: 'Public/member-facing access for OneGodian systems and OMOS Production Documentation Release 1.0.',
    url: '/',
    siteName: 'The OneGodian App',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AppShell>{children}</AppShell>
    </html>
  );
}
