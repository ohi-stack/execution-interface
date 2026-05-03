'use client';

import { useEffect, useMemo, useState } from 'react';

type Player = { name: string; color: string; balance: number };
const COLORS = ['cyan', 'emerald', 'violet', 'amber', 'rose'];
const MAX_PLAYERS = 6;

export function BingoDemo() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [called, setCalled] = useState<number[]>([]);
  const [cardPrice, setCardPrice] = useState(5);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('og-bingo-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCalled((prev) => {
        if (winner || prev.length >= 75) return prev;
        const pool = Array.from({ length: 75 }, (_, i) => i + 1).filter((n) => !prev.includes(n));
        const next = pool[Math.floor(Math.random() * pool.length)];
        return [...prev, next];
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [winner]);

  const join = () => {
    if (!name.trim() || players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [...prev, { name: name.trim(), color, balance: 100 }]);
    setName('');
  };

  const celebrateWinner = () => {
    if (!players.length) return;
    const selected = players[Math.floor(Math.random() * players.length)].name;
    setWinner(selected);
    const nextHistory = [`${new Date().toISOString()} — ${selected}`, ...history].slice(0, 20);
    setHistory(nextHistory);
    localStorage.setItem('og-bingo-history', JSON.stringify(nextHistory));
  };

  const latestCall = useMemo(() => called[called.length - 1], [called]);

  return <div className="space-y-4">
    <div className="rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-cyan-500/10 p-4">
      <p className="text-sm text-amber-200">Cash / Prize Room Styling • Auto Calling • Sound FX (visual demo)</p>
      <p className="mt-1 text-xs text-slate-300">Demo game only. No real-money wagering, deposits, withdrawals, or prize payouts are enabled.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
        <h3 className="font-semibold">Join Flow</h3>
        <div className="mt-3 space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" className="h-11 w-full rounded border border-slate-600 bg-slate-950 px-3" />
          <select value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-full rounded border border-slate-600 bg-slate-950 px-3">
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={join} className="h-11 w-full rounded bg-cyan-500/20">Join Game ({players.length}/{MAX_PLAYERS})</button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
        <h3 className="font-semibold">Host Controls</h3>
        <label className="mt-3 block text-sm">Card Price: ${cardPrice}</label>
        <input type="range" min={1} max={25} value={cardPrice} onChange={(e) => setCardPrice(Number(e.target.value))} className="w-full" />
        <button onClick={celebrateWinner} className="mt-3 h-11 w-full rounded bg-emerald-500/20">Pick Winner</button>
      </div>
    </div>
    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="font-semibold">Live Calls</h3>
      <p className="mt-2 text-sm text-slate-300">Latest number: <span className="font-bold text-cyan-300">{latestCall ?? 'Waiting...'}</span></p>
      <p className="text-xs text-slate-400">Automatic number calling every 3.5 seconds.</p>
    </div>
    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="font-semibold">Players</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {players.map((p) => <li key={p.name}>• {p.name} ({p.color}) — Balance: ${p.balance} <button onClick={() => setPlayers((prev) => prev.map((x) => x.name === p.name ? { ...x, balance: x.balance + 10 } : x))} className="ml-2 rounded border border-slate-600 px-2 py-0.5 text-xs">Add Funds</button></li>)}
      </ul>
      {winner && <p className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-500/15 p-2 text-emerald-200">🏆 Winner: {winner}! Celebration animation ready.</p>}
    </div>
    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="font-semibold">History Tab</h3>
      <ul className="mt-2 space-y-1 text-xs text-slate-300">{history.map((h) => <li key={h}>{h}</li>)}</ul>
    </div>
  </div>;
}
