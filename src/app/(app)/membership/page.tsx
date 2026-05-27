export default function Page() { return <main className="space-y-6"><h1 className="text-3xl font-bold">Membership</h1><p className="text-slate-300">Membership provides dashboard-linked participation paths, identity services, and voluntary community features across the OneGodian ecosystem.</p></main>; }
export default function MembershipPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">OneGodian Membership</h1>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-300">
        <p>Membership provides access to profile records, campaign participation, tools, and platform learning resources.</p>
        <p className="mt-2">Dashboard entry is available from the member node and remains compatible with admin/control-plane reporting via manifest and status surfaces.</p>
      </section>
    </main>
  );
}
