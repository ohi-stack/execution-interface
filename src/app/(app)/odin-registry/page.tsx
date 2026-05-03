import Link from 'next/link';

export default function OdinRegistryRedirectPage() {
  return (
    <main className='min-h-screen px-6 py-10'>
      <div className='mx-auto max-w-3xl rounded-xl border border-slate-700 bg-slate-900/70 p-6'>
        <h1 className='text-3xl font-bold'>ODIN Registry</h1>
        <p className='mt-3 text-slate-300'>The ODIN content pages are now available under /odin.</p>
        <Link href='/odin' className='mt-4 inline-block rounded bg-blue-700 px-3 py-2'>Go to ODIN Registry™</Link>
      </div>
    </main>
  );
}
