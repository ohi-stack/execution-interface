'use client';

import { TouchEvent, useMemo, useState } from 'react';
import { submitBeliefMapperProfile } from '@/lib/beliefMapper/api';
import type { BeliefMapperAnswer, BeliefMapperQuestion } from '@/lib/beliefMapper/scoring';
import { getBeliefMapperCompletion, getBeliefMapperResult } from '@/lib/beliefMapper/scoring';
import { ProgressBar } from './ProgressBar';
import { ResultCard } from './ResultCard';

type QuestionCardProps = {
  questions: BeliefMapperQuestion[];
};

export function QuestionCard({ questions }: QuestionCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<BeliefMapperAnswer[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const activeQuestion = questions[activeIndex];
  const completed = answers.length >= questions.length;
  const result = useMemo(() => getBeliefMapperResult(answers), [answers]);

  function answer(optionId: string) {
    if (!activeQuestion) {
      return;
    }

    setAnswers((currentAnswers) => {
      const nextAnswers = currentAnswers.filter((item) => item.questionId !== activeQuestion.id);
      return [...nextAnswers, { questionId: activeQuestion.id, optionId }];
    });

    setActiveIndex((currentIndex) => Math.min(currentIndex + 1, questions.length));
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStart === null || !activeQuestion) {
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStart;
    const selectedOption = delta < -40 ? activeQuestion.options[0] : delta > 40 ? activeQuestion.options[activeQuestion.options.length - 1] : null;

    if (selectedOption) {
      answer(selectedOption.id);
    }

    setTouchStart(null);
  }

  async function saveProfile(consentToSave: boolean) {
    const response = await submitBeliefMapperProfile({ answers, consentToSave });
    setSaveMessage(response.message);
  }

  if (completed) {
    return (
      <div className="space-y-5">
        <ProgressBar value={100} label="Question flow" />
        <ResultCard result={result} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => saveProfile(false)} className="rounded-full border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-300">Finish without saving</button>
          <button type="button" onClick={() => saveProfile(true)} className="rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Save with consent</button>
        </div>
        {saveMessage ? <p className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">{saveMessage}</p> : null}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <ProgressBar value={getBeliefMapperCompletion(answers)} label="Question flow" />
      <div
        className="touch-pan-y rounded-[2rem] border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30"
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Question {activeIndex + 1} of {questions.length}</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-100">{activeQuestion.prompt}</h2>
        <p className="mt-2 text-sm text-slate-400">{activeQuestion.hint}</p>
        <div className="mt-5 grid gap-3">
          {activeQuestion.options.map((option) => (
            <button key={option.id} type="button" onClick={() => answer(option.id)} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-left transition hover:border-cyan-300 active:scale-[0.99]">
              <span className="block text-base font-semibold text-slate-100">{option.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-400">{option.description}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">Mobile shortcut: swipe left for the first answer or right for the last answer.</p>
      </div>
    </section>
  );
}
