import Link from 'next/link';
import { games } from '@/lib/games';

export default function GamesPage() {
  const featured = games[0];
  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian Games</h1>
        <p className="mt-3 text-slate-300">Interactive games, prize-room interfaces, and educational play modules for the OneGodian App.</p>
      </section>
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Featured Game</p>
        <h2 className="mt-2 text-2xl font-semibold">{featured.title}</h2>
        <p className="mt-2 text-sm text-slate-300">Status: {featured.status}</p>
        <p className="mt-2 text-sm text-slate-300">Route: {featured.route}</p>
        <p className="mt-3 text-slate-300">{featured.description}</p>
        <Link href={featured.route} className="mt-4 inline-flex rounded-lg border border-cyan-400/70 px-4 py-2 text-sm text-cyan-200">Open Featured Game</Link>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Game Library</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {games.map((game) => (
            <article key={game.slug} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <h3 className="font-semibold">{game.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{game.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Roadmap</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {games.map((game) => <li key={`${game.slug}-status`}>• {game.title} — {game.status} ({game.priority} priority)</li>)}
        </ul>
      </section>
    </main>
  );
}
