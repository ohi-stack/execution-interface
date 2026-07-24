import { NextResponse } from 'next/server';
import { getSyncStatus } from '@/services/sync';
export async function GET() { return NextResponse.json(await getSyncStatus()); }
