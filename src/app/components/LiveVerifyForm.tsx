'use client';

import { FormEvent, useState } from 'react';

const VERIFY_BASE_URL = process.env.NEXT_PUBLIC_VERIFY_BASE_URL ?? 'https://verify.qrv.network';

export function LiveVerifyForm({ demoRecordId }: { demoRecordId: string }) {
  const [qrvid, setQrvid] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = qrvid.trim();
    if (!value) return;
    window.location.assign(`${VERIFY_BASE_URL}/${encodeURIComponent(value)}`);
  };

  return (
    <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <input
        aria-label="Enter QRVID"
        className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring"
        onChange={(event) => setQrvid(event.target.value)}
        placeholder="Enter QRVID"
        value={qrvid}
      />
      <button className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100" type="submit">Verify</button>
      <a className="rounded-xl border border-slate-500/60 px-5 py-3 text-center text-sm font-semibold text-slate-100" href={`${VERIFY_BASE_URL}/${demoRecordId}`}>Try Demo Record</a>
    </form>
  );
}
