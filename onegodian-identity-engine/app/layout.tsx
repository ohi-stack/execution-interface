import './globals.css';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'ONEGODIAN IDENTITY ENGINE™',
  description: 'Revenue-ready identity funnel with declaration card + obsidian seal generation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
