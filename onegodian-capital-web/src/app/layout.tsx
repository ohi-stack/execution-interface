import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'ONEGODIAN Capital Portal',
  description: 'Disclosure-first capital portal UI and recordkeeping infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
        <Footer />
      </body>
    </html>
  );
}
