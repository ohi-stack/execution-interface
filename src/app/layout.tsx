import './globals.css';
import type { Metadata } from 'next';
import { CapitalNavigation } from './components/CapitalNavigation';
import { CapitalFooter } from './components/CapitalFooter';

export const metadata: Metadata = {
  title: 'ONEGODIAN Capital Portal',
  description: 'Administrative capital infrastructure interface for capital.onegodian.com'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CapitalNavigation />
        {children}
        <CapitalFooter />
      </body>
    </html>
  );
}
