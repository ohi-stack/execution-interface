import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/pricing';
import { stripe } from '@/lib/stripe';
import { getSiteUrl } from '@/lib/siteUrl';

export async function POST(req: Request) {
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
    success_url: `${getSiteUrl()}/dashboard?checkout=success`,
    cancel_url: `${getSiteUrl()}/pricing?checkout=cancel`,
    customer_email: email,
    metadata: { tier, artifactId: artifactId ?? '', referralCode: referralCode ?? '' }
  });

  return NextResponse.json({ url: session.url });
}
