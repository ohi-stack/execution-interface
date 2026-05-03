import { BingoDemo } from '@/components/games/bingo-demo';

export default function BingoPage() {
  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Lucky Pot Bingo</h1>
        <p className="mt-3 text-slate-300">Demo-ready multiplayer bingo experience for OneGodian Games.</p>
      </section>
      <BingoDemo />
    </main>
  );
}
