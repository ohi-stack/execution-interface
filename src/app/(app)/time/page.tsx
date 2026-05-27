export default function Page() {
  const gregorian = new Date().toISOString().slice(0, 10);
  const ots = 'OTS-V5 active chronology view';
  return <main className="space-y-6"><h1 className="text-3xl font-bold">OneGodian Time™ · OTS-V5</h1><p className="text-slate-300">Dual-date view for platform coordination and historical references.</p><div className="grid gap-4 md:grid-cols-2"><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="text-cyan-200">Gregorian Date</h2><p className="mt-2 text-slate-100">{gregorian}</p></article><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="text-cyan-200">OneGodian Date</h2><p className="mt-2 text-slate-100">{ots}</p></article></div><p className="text-sm text-slate-400">Legal safety notice: OneGodian Time™ is an internal cultural/system chronology aid. It does not replace legal, regulatory, tax, court, banking, or governmental date standards.</p></main>;
}
