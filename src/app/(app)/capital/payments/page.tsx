export default function CapitalPaymentsPage() {
  const items = ['Stripe transactions', 'WooCommerce orders', 'unpaid invoices', 'failed payments', 'refunds', 'receipts', 'certificate issuance status'];
  return <main className="space-y-3"><h1 className="text-3xl font-semibold">Capital Payments</h1><div className="grid gap-3 md:grid-cols-2">{items.map((item)=><article key={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">{item}: Needs API</article>)}</div></main>;
}
