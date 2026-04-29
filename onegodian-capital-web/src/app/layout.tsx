import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ONEGODIAN Capital Portal',
  description:
    'Platform infrastructure for capital offering records, disclosure review, investor dashboard previews, ledgers, and certificate verification in test-mode workflows.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
