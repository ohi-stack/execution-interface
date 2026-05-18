import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ executed: false, reason: 'ocp_authorization_required' }, { status: 403 }); }
