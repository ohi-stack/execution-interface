import { JournalEntryForm } from '@/components/belief-mapper/JournalEntryForm';

export default function BeliefMapperJournalPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Journal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Reflect before you store.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Use private notes to process questions, guidance, and next steps. Syncing should be opt-in only.</p>
      </header>
      <JournalEntryForm />
    </main>
  );
}
