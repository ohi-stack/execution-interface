import { NextResponse } from 'next/server';
export async function POST(_: Request, { params }: { params: { id: string } }) { return NextResponse.json({ jobId: params.id, status: 'retry_queued' }, { status: 202 }); }
