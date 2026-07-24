import { NextResponse } from 'next/server';
import { enqueueManualSync } from '@/services/sync';
export async function POST() { return NextResponse.json(await enqueueManualSync(), { status: 202 }); }
