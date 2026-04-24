import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (_e) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { error: orderError } = await supabaseAdmin.from('orders').upsert(
      {
        stripe_session_id: session.id,
        email: session.customer_details?.email,
        tier: session.metadata?.tier,
        artifact_id: session.metadata?.artifactId,
        referral_code: session.metadata?.referralCode,
        amount_total: session.amount_total,
        paid_at: new Date().toISOString()
      },
      {
        onConflict: 'stripe_session_id',
        ignoreDuplicates: true
      }
    );

    if (orderError) {
      return NextResponse.json({ error: 'Failed to persist order' }, { status: 500 });
    }

    const { error: artifactError } = await supabaseAdmin
      .from('identity_artifacts')
      .update({ preview_only: false, hd_ready: true })
      .eq('id', session.metadata?.artifactId);

    if (artifactError) {
      return NextResponse.json({ error: 'Failed to unlock artifact' }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
