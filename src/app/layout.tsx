import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://OMOS.OneGodian.com'),
  title: { default: 'OMOS.OneGodian.com | OneGodian Metaphysical Operating System™', template: '%s | OMOS™' },
  description: 'The systems-architecture layer of the OneGodian ecosystem for protocol governance, alignment logic, AI interaction standards, and operational intelligence.',
  applicationName: 'OMOS.OneGodian.com',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { title: 'OMOS.OneGodian.com', description: 'OneGodian Metaphysical Operating System™ architecture node.', url: 'https://OMOS.OneGodian.com', siteName: 'OMOS.OneGodian.com', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><AppShell>{children}</AppShell></html>; }
