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
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-100 outline-none ring-gold-300/30 placeholder:text-slate-500 focus:border-gold-300/50 focus:ring"
        onChange={(event) => setQrvid(event.target.value)}
        placeholder="Enter QRVID"
        value={qrvid}
      />
      <button className="premium-button" type="submit">Verify</button>
      <a className="premium-button-secondary text-center" href={`${VERIFY_BASE_URL}/${demoRecordId}`}>Try Demo Record</a>
    </form>
  );
}
