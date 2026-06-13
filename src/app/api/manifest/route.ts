import { NextResponse } from 'next/server';
import { manifest } from '@/data/manifest';
export function GET() { return NextResponse.json(manifest); }
