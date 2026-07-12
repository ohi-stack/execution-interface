import { SESSION_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
export default function Page(){cookies().delete(SESSION_COOKIE); return <main className="rounded-[2rem] border border-white/10 bg-white/[.055] p-8"><h1 className="text-4xl font-black">Logged out</h1><Link className="mt-5 inline-flex min-h-11 rounded-full bg-[#D8B35A] px-5 py-3 font-black text-black" href="/login">Return to login</Link></main>}
