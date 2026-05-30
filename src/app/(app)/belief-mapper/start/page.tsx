import { QuestionCard } from '@/components/belief-mapper/QuestionCard';
import { beliefMapperQuestions } from '@/lib/beliefMapper/scoring';

export default function BeliefMapperStartPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-3xl border border-cyan-400/30 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Belief Mapper™ Start</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Swipe or tap through the questions.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Answers calculate an immediate profile. Saving is optional and requires explicit consent.</p>
      </header>
      <QuestionCard questions={beliefMapperQuestions} />
    </main>
  );
}
