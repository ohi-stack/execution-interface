import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/siteUrl';

export async function POST(req: Request) {
  const { userId } = await req.json();
  const code = `ONE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { error } = await supabaseAdmin.from('referrals').insert({ user_id: userId, code });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ code, referralUrl: `${getSiteUrl()}/pricing?ref=${code}` });
}
