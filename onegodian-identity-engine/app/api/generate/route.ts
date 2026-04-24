import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/siteUrl';

const schema = z.object({
  fullName: z.string().min(2),
  calling: z.string().min(2),
  promise: z.string().min(8)
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const previewText = `${payload.fullName}, you are called to ${payload.calling}. ${payload.promise}`;

  const { data, error } = await supabaseAdmin
    .from('identity_artifacts')
    .insert({
      full_name: payload.fullName,
      calling: payload.calling,
      promise: payload.promise,
      preview_text: previewText,
      preview_only: true
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    artifactId: data.id,
    previewText,
    declaration: `${getSiteUrl()}/placeholder/declaration-preview.svg`,
    seal: `${getSiteUrl()}/placeholder/seal-preview.svg`
  });
}
