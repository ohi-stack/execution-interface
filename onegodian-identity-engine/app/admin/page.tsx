'use client';

import { useEffect, useState } from 'react';

type Metrics = {
  grossRevenue: number;
  orders: number;
  conversionRate: string;
  topTier: string;
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold text-gold">Admin Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Gross Revenue</p><p className="mt-2 text-2xl font-bold">${metrics?.grossRevenue ?? 0}</p></div>
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Orders</p><p className="mt-2 text-2xl font-bold">{metrics?.orders ?? 0}</p></div>
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Conversion Rate</p><p className="mt-2 text-2xl font-bold">{metrics?.conversionRate ?? '0%'} </p></div>
        <div className="card-panel p-5"><p className="text-sm text-zinc-400">Top Tier</p><p className="mt-2 text-2xl font-bold">{metrics?.topTier ?? 'starter'}</p></div>
      </div>
    </section>
  );
}
