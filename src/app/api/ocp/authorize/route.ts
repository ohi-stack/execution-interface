import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ authorized: false, reason: 'ocp_review_required' }, { status: 403 }); }
