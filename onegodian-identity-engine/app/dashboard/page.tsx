export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Member Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Total Purchases</p><p className="mt-2 text-3xl font-bold text-gold">$0</p></div>
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Downloads Left</p><p className="mt-2 text-3xl font-bold text-gold">0</p></div>
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Referral Earnings</p><p className="mt-2 text-3xl font-bold text-gold">$0</p></div>
      </div>
      <div className="card-panel p-6">
        <h2 className="text-xl font-semibold">Download History</h2>
        <p className="mt-2 text-zinc-400">Integrate this page with Supabase table <code>download_history</code> and render user transactions chronologically.</p>
      </div>
    </section>
  );
}
