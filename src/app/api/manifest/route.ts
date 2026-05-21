import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const host = headers().get('host') ?? '';
  const isConsole = host.startsWith('console.onegodian.com');
  return NextResponse.json(
    isConsole
      ? { app: 'OneGodian Console', domain: 'console.onegodian.com', type: 'internal-control-plane', modules: ['admin','dashboard','agents','tasks','workflows','ocp','oeg','adapters','approvals','audit','logs','settings','status'] }
      : { app: 'OneGodian App', domain: 'app.onegodian.com', type: 'public-member-app', modules: ['dashboard','ecosystem','registry','tools','members','certificates','products','media','settings','docs'] }
  );
}
