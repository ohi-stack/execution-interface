import { NextResponse } from 'next/server'; import { apiSuccess, overallStatus, services } from '@/lib/odc';
export function GET(){return NextResponse.json(apiSuccess({overall:overallStatus(),services,productionServices:services.filter(x=>x.production).length}))}
