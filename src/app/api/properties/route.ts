import { NextResponse } from 'next/server';
import { propertyRegistry } from '@/lib/property-registry';

export async function GET() {
  return NextResponse.json({ properties: propertyRegistry, total: propertyRegistry.length });
}
