import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ sections: ['Architecture','API','Deployment','Security','WordPress Bridge','Disclosures','Version History','Production Checklist'], url: `${ODC.canonicalUrl}/docs` }),{headers:cacheHeaders})}
