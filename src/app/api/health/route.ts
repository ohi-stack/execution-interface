import { NextResponse } from 'next/server'; import { apiSuccess } from '@/lib/odc';
export function GET(){return NextResponse.json(apiSuccess({ok:true,service:'odc-public-platform',version:'0.2.0',environment:process.env.NODE_ENV,timestamp:new Date().toISOString()}))}
