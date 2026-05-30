'use client';

import { FormEvent, useState } from 'react';

export function JournalEntryForm() {
  const [savedAt, setSavedAt] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedAt(new Date().toLocaleString());
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h2 className="text-xl font-semibold text-slate-100">Journal checkpoint</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">Capture a private reflection. Production storage should require explicit consent before syncing beyond the device.</p>
      <textarea name="entry" rows={7} className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300" placeholder="What did this question reveal about your current path?" />
      <button type="submit" className="mt-4 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Save private note</button>
      {savedAt ? <p className="mt-3 text-sm text-cyan-200">Draft checkpoint saved locally at {savedAt}.</p> : null}
    </form>
  );
}
