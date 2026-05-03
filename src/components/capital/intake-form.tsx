'use client';

import { useState } from 'react';
import { CapitalIntakePayload, submitCapitalIntake } from '@/lib/capital';

const initial: CapitalIntakePayload = { fullName: '', email: '', phone: '', interestType: 'notes', estimatedContributionAmount: '', accreditedInvestor: 'unknown', riskAcknowledgment: false, notes: '' };

export function CapitalIntakeForm() {
  const [form, setForm] = useState<CapitalIntakePayload>(initial);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.estimatedContributionAmount || !form.riskAcknowledgment) {
      setError('Please complete all required fields and acknowledge risk.');
      return;
    }
    setError('');
    await submitCapitalIntake(form);
    setDone(true);
    setForm(initial);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {done && <p className="text-sm text-emerald-300">Expression of interest received. Our team will follow up through formal compliance review.</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
      <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
      <input required value={form.estimatedContributionAmount} onChange={(e) => setForm({ ...form, estimatedContributionAmount: e.target.value })} placeholder="Estimated contribution amount" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
      <select value={form.interestType} onChange={(e) => setForm({ ...form, interestType: e.target.value as CapitalIntakePayload['interestType'] })} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
        <option value="notes">notes</option><option value="bonds">bonds</option><option value="licensing">licensing</option><option value="api">api</option><option value="membership">membership</option><option value="partnership">partnership</option>
      </select>
      <select value={form.accreditedInvestor} onChange={(e) => setForm({ ...form, accreditedInvestor: e.target.value as CapitalIntakePayload['accreditedInvestor'] })} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
        <option value="yes">yes</option><option value="no">no</option><option value="unknown">unknown</option>
      </select>
      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.riskAcknowledgment} onChange={(e) => setForm({ ...form, riskAcknowledgment: e.target.checked })} /> Risk acknowledgment</label>
      <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">Submit expression of interest</button>
    </form>
  );
}
