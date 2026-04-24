import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserByBearer } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserByBearer(req.headers.get('authorization'));

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('download_history')
    .select('*')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
