import { supabaseAdmin } from '@/lib/supabase';

export async function getUserByBearer(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const jwt = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(jwt);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}
