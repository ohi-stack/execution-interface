import { NextResponse } from 'next/server';
import { tools } from '@/data/tools';
export function GET() { return NextResponse.json(tools.map(({ title, href, description }) => ({ title, href, description }))); }
