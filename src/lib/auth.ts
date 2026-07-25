import { cookies } from 'next/headers';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import argon2 from 'argon2';
import { roleRank, type Role } from '@/data/platform';
export const SESSION_COOKIE='omos_session'; export const CSRF_COOKIE='omos_csrf';
const SESSION_TTL_SECONDS=Number(process.env.OMOS_SESSION_TTL_SECONDS ?? 60*60*8);
export type SessionUser={id:string; email:string; role:Role; expiresAt:number};
function secret(){const v=process.env.OMOS_SESSION_SECRET; if(!v && process.env.NODE_ENV==='production') throw new Error('OMOS_SESSION_SECRET is required in production'); return v ?? 'development-only-session-secret-change-me';}
function sign(payload:string){return createHash('sha256').update(payload+secret()).digest('hex')}
export function createSessionToken(user: Omit<SessionUser,'expiresAt'>){const session={...user,expiresAt:Date.now()+SESSION_TTL_SECONDS*1000}; const payload=Buffer.from(JSON.stringify(session)).toString('base64url'); return payload+'.'+sign(payload)}
export function readSessionToken(token?:string):SessionUser|null{try{if(!token) return null; const [payload,sig]=token.split('.'); if(!payload||!sig||sign(payload)!==sig) return null; const s=JSON.parse(Buffer.from(payload,'base64url').toString()) as SessionUser; return s.expiresAt>Date.now()?s:null}catch{return null}}
export function currentSession(){return readSessionToken(cookies().get(SESSION_COOKIE)?.value)}
export function requireRole(required:Role){const s=currentSession(); if(!s||roleRank[s.role]<roleRank[required]) return null; return s}
export function hashPassword(password:string){return argon2.hash(password,{type:argon2.argon2id,memoryCost:19456,timeCost:2,parallelism:1})}
export async function verifyPassword(password:string, stored:string){if(stored.startsWith('$argon2id$')) return argon2.verify(stored,password); const [alg,salt,hash]=stored.split('$'); if(alg!=='scrypt'||!salt||!hash) return false; const candidate=scryptSync(password,salt,64); return timingSafeEqual(candidate,Buffer.from(hash,'hex'))}
export function csrfToken(){return randomBytes(32).toString('base64url')}
