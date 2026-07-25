import { NextResponse } from 'next/server';import { currentSession } from '@/lib/auth';
export async function GET(){const session=currentSession();return NextResponse.json(session?{authenticated:true,user:{id:session.id,email:session.email,role:session.role},expiresAt:new Date(session.expiresAt).toISOString()}:{authenticated:false},{status:session?200:401})}
