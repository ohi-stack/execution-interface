import { NextResponse } from 'next/server';
import { defaultFundingTracker } from '@/lib/capital';

export async function GET() {
  return NextResponse.json(defaultFundingTracker);
}
