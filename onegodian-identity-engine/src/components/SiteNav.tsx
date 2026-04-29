import Link from 'next/link';

const links = [
  ['Home', '/'],
  ['Create', '/create'],
  ['Pricing', '/pricing'],
  ['Dashboard', '/dashboard'],
  ['About', '/about'],
  ['FAQ', '/faq']
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.25em] text-gold">
          ONEGODIAN IDENTITY ENGINE™
        </Link>
        <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-gold">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
