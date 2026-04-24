import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getUserByBearer } from '@/lib/auth';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!checkRateLimit(`email:${clientKey(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const user = await getUserByBearer(req.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, name, downloadUrl } = await req.json();

  if (!to || !downloadUrl) {
    return NextResponse.json({ error: 'Missing recipient or URL' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY ?? 're_dev');

  const { error } = await resend.emails.send({
    from: 'ONEGODIAN <deliver@onegodian.org>',
    to,
    subject: 'Your ONEGODIAN HD Identity Assets',
    html: `<p>${name ?? user.email ?? 'Member'}, your HD declaration package is ready.</p><p><a href="${downloadUrl}">Download now</a></p>`
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
