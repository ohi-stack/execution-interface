import Link from 'next/link';
import { games } from '@/lib/games';

export default function GamesPage() {
  const featured = games.find((game) => game.slug === 'bingo') ?? games[0];

  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">A. Hero</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">OneGodian Games</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Interactive games, prize-room interfaces, and educational play modules for the OneGodian App.</p>
      </section>

      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">B. Featured Game</p>
        <h2 className="mt-2 text-2xl font-semibold">Lucky Pot Bingo</h2>
        <p className="mt-3 text-sm text-slate-300">A mobile-first bingo room interface with automatic number calling, multiplayer player list, join flow, sound effects, cash/prize styling, card pricing, max-player limits, player colors, winner highlighting, and local history tracking.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/games/bingo" className="inline-flex min-h-11 items-center rounded-lg border border-cyan-400/70 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-200">Play Demo</Link>
          <Link href={featured.route} className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200">View Details</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">C. Game Library</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {games.map((game) => (
            <article key={game.slug} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <h3 className="font-semibold">{game.title}</h3>
              <p className="mt-1 text-xs text-cyan-300">Status: {game.status}</p>
              <p className="mt-2 text-sm text-slate-300">{game.description}</p>
              <p className="mt-2 text-xs text-slate-400">{game.route}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">D. Game Status / Roadmap</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {games.map((game) => <li key={`${game.slug}-status`}>• {game.title} — {game.status} ({game.priority} priority)</li>)}
        </ul>
      </section>
    </main>
  );
}
