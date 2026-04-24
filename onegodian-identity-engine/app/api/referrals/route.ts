import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserByBearer } from '@/lib/auth';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!checkRateLimit(`referrals:${clientKey(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const user = await getUserByBearer(req.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const code = `ONE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const { error } = await supabaseAdmin.from('referrals').insert({ user_id: user.id, code });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ code, referralUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?ref=${code}` });
}
