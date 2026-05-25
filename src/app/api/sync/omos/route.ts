import { NextResponse } from 'next/server';
import { syncOmos } from '@/lib/omos-sync';

export async function GET() {
  const result = await syncOmos();
  return NextResponse.json(result);
}
