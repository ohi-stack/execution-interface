'use client';

import { FormEvent, useState } from 'react';

export function EmailCaptureForm() {
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    setMessage(email ? 'Saved locally for the Belief Mapper™ follow-up experience.' : 'Enter an email to continue.');
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h2 className="text-xl font-semibold text-slate-100">Send my next step</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">Optional. Use only with explicit consent to receive Belief Mapper™ reminders and pathway links.</p>
      <label className="mt-4 block text-sm font-medium text-slate-200" htmlFor="belief-mapper-email">Email</label>
      <input id="belief-mapper-email" name="email" type="email" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300" placeholder="you@example.com" />
      <button type="submit" className="mt-4 w-full rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Save follow-up</button>
      {message ? <p className="mt-3 text-sm text-cyan-200">{message}</p> : null}
    </form>
  );
}
