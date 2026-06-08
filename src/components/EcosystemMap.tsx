const nodes = [
  ['OneGodian.org', 'Public education', 'Public Layer'],
  ['OneGodian.com', 'Commerce and memberships', 'Commerce Layer'],
  ['OMOS', 'Runtime services', 'Runtime Layer'],
  ['u.OneGodian.com', 'Learning pathways', 'Education Layer'],
  ['QRV.Network', 'Verification', 'Verification Layer'],
  ['Media', 'Culture and campaigns', 'Media Layer']
];

export function EcosystemMap() {
  return (
    <section className="glass-panel overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Ecosystem Map</p>
          <h2 className="mt-2 text-2xl font-black text-white">Connected public/member surfaces</h2>
        </div>
        <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-xs font-bold text-gold-100">Public safe</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map(([name, role, layer]) => (
          <article key={name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-purple-200">{layer}</p>
            <h3 className="mt-2 text-lg font-bold text-white">{name}</h3>
            <p className="mt-1 text-sm text-slate-300">{role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
