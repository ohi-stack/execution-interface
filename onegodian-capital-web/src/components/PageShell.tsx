import Link from 'next/link';

const links = ['offerings', 'investor-portal', 'disclosures', 'certificates', 'compliance-status', 'support'];

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-lg font-bold text-white">ONEGODIAN Capital</Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            {links.map((link) => (
              <Link key={link} href={`/${link}`} className="text-white hover:text-gold">{link.replace('-', ' ')}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
