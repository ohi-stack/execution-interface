import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const { to, name, downloadUrl } = await req.json();
  const resend = new Resend(process.env.RESEND_API_KEY ?? 're_dev');

  const { error } = await resend.emails.send({
    from: 'ONEGODIAN <deliver@onegodian.org>',
    to,
    subject: 'Your ONEGODIAN HD Identity Assets',
    html: `<p>${name}, your HD declaration package is ready.</p><p><a href="${downloadUrl}">Download now</a></p>`
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
