import Link from 'next/link';

export function CapitalFooter() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/legal">Legal</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">© 2026 QRV Network</div>
    </footer>
  );
}
