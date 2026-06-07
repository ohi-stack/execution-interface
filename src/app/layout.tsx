import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AppShell>{children}</AppShell>
    </html>
  );
}
