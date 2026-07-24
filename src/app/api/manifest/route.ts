import { NextResponse } from 'next/server';
import { publicManifest } from '@/lib/platform';
export function GET() { return NextResponse.json(publicManifest()); }
