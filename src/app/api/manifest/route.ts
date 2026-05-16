import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ app: 'OneGodian Control Plane', domain: 'app.onegodian.com', type: 'control-plane', modules: ['dashboard','ecosystem','apps','plugins','registry','certificates','members','tools','campaigns','media','api-status','admin'] }); }
