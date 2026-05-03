import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OneGodian Everything App',
  description: 'OneGodian command center for app.onegodian.com'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
