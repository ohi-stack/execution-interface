import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin';

export async function GET() {
  const adminToken = headers().get('x-admin-token');

  if (!isAdminRequest(adminToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [ordersRes, previewsRes] = await Promise.all([
    supabaseAdmin.from('orders').select('tier, amount_total', { count: 'exact' }),
    supabaseAdmin.from('identity_artifacts').select('id', { count: 'exact' })
  ]);

  const orders = ordersRes.data ?? [];
  const grossRevenue = orders.reduce((sum, row) => sum + (row.amount_total ?? 0), 0) / 100;
  const tierCounts = orders.reduce<Record<string, number>>((acc, order) => {
    const tier = order.tier ?? 'starter';
    acc[tier] = (acc[tier] ?? 0) + 1;
    return acc;
  }, {});

  const topTier = Object.entries(tierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'starter';
  const previewCount = previewsRes.count ?? 0;
  const orderCount = ordersRes.count ?? 0;

  return NextResponse.json({
    grossRevenue,
    orders: orderCount,
    conversionRate: previewCount ? `${Math.round((orderCount / previewCount) * 100)}%` : '0%',
    topTier
  });
}
