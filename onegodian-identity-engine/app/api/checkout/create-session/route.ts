import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/pricing';
import { stripe } from '@/lib/stripe';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!checkRateLimit(`checkout:${clientKey(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { tier, artifactId, email, referralCode } = await req.json();
  const product = PRODUCTS.find((p) => p.tier === tier);

  if (!product) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  const priceId = process.env[product.stripePriceIdEnv];

  if (!priceId) {
    return NextResponse.json({ error: `Missing ${product.stripePriceIdEnv}` }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?checkout=cancel`,
    customer_email: email,
    metadata: { tier, artifactId: artifactId ?? '', referralCode: referralCode ?? '' }
  });

  return NextResponse.json({ url: session.url });
}
