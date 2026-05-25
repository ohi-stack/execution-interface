import { NextResponse } from 'next/server';
import { pluginRegistry } from '@/lib/plugin-registry';

export async function GET() {
  return NextResponse.json({ plugins: pluginRegistry, total: pluginRegistry.length });
}
