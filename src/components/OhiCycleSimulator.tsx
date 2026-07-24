'use client';

import { useMemo, useState } from 'react';
import { buildReviewMatrix, extractComparativeSignals, ohiProviderLabels } from '@/lib/ohi/review';
import { ohiModelAdapters, runSimulatedOhiAdapters, type OhiModelOutput } from '@/lib/ohi/adapters';

const defaultQuestion = 'How should a human team turn several AI opinions into one trustworthy action plan?';

export function OhiCycleSimulator() {
  const [question, setQuestion] = useState(defaultQuestion);
  const [hasRun, setHasRun] = useState(false);
  const [outputs, setOutputs] = useState<OhiModelOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const matrix = useMemo(() => buildReviewMatrix(outputs), [outputs]);
  const signals = useMemo(() => extractComparativeSignals(outputs), [outputs]);

  async function runCycle() {
    setIsRunning(true);
    const simulatedOutputs = await runSimulatedOhiAdapters(question);
    setOutputs(simulatedOutputs);
    setHasRun(true);
    window.setTimeout(() => setIsRunning(false), 420);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-[#D8B35A]/25 bg-[#030811]/90 p-4 shadow-gold md:p-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_18%_15%,rgba(216,179,90,.18),transparent_26rem),radial-gradient(circle_at_82%_20%,rgba(111,60,255,.25),transparent_28rem),linear-gradient(135deg,#02040a_0%,#071827_55%,#05010c_100%)] p-4 md:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#F0D98A]">Simulation mode • public safe</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Interactive OHI Cross-Model Review Cycle</h2>
              <p className="mt-4 max-w-3xl text-slate-300">Enter a human question, run simulated GPT, Claude, Gemini, and Grok lanes, then inspect comparative signals before the final OHI output is synthesized. No external AI providers are called on this page.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/35 p-4">
              <label htmlFor="ohi-question" className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">Human Question</label>
              <textarea id="ohi-question" value={question} onChange={(event) => setQuestion(event.target.value)} className="mt-3 min-h-28 w-full rounded-2xl border border-[#D8B35A]/25 bg-[#050711] p-4 text-sm text-white outline-none ring-[#D8B35A]/40 focus:ring-2" />
              <button type="button" onClick={runCycle} disabled={isRunning || question.trim().length === 0} className="mt-3 w-full rounded-2xl bg-[#D8B35A] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#071827] transition hover:bg-[#F0D98A] disabled:cursor-not-allowed disabled:opacity-50">{isRunning ? 'Running cycle…' : 'Run OHI Cycle'}</button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {ohiModelAdapters.map((adapter, index) => (
              <div key={adapter.provider} className={`ohi-lane rounded-3xl border p-4 transition ${hasRun ? 'border-[#D8B35A]/70 bg-[#D8B35A]/10' : 'border-[#6F3CFF]/35 bg-white/[0.055]'}`} style={{ animationDelay: `${index * 160}ms` }}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F0D98A]">{adapter.mode} adapter</p>
                <h3 className="mt-2 text-2xl font-black text-white">{adapter.displayName}</h3>
                <p className="mt-2 text-xs text-slate-300">Ready for future live {adapter.provider} orchestration.</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasRun && (
        <div className="space-y-8">
          <Stage title="Round 1: Independent Outputs" kicker="separate model lanes">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {outputs.map((output) => <OutputPanel key={output.provider} output={output} />)}
            </div>
          </Stage>

          <Stage title="Cross-Model Review Matrix" kicker="animated comparative pass">
            <div className="ohi-cycle-motion mb-5 rounded-3xl border border-[#6F3CFF]/35 bg-black/30 p-4 text-center text-sm font-bold text-[#F0D98A]">Independent outputs move into the cross-model review cycle → agreements, contradictions, missing ideas, and novel insights are extracted.</div>
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
              {matrix.map((cell) => <div key={`${cell.reviewer}-${cell.subject}`} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3"><p className="text-xs font-black text-[#F0D98A]">{ohiProviderLabels[cell.reviewer]} reviews {ohiProviderLabels[cell.subject]}</p><p className="mt-2 text-xs text-slate-300">{cell.signal}</p><span className="mt-3 inline-block rounded-full border border-[#D8B35A]/30 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">{cell.emphasis}</span></div>)}
            </div>
          </Stage>

          <Stage title="Human Synthesis Layer" kicker="inspect comparative signals">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SignalList title="Agreement Zones" items={signals.agreements} />
              <SignalList title="Contradictions" items={signals.contradictions} />
              <SignalList title="Missing Ideas" items={signals.missingIdeas} />
              <SignalList title="Novel Insights" items={signals.novelInsights} />
            </div>
          </Stage>

          <div className="rounded-[2rem] border border-[#D8B35A]/50 bg-[linear-gradient(135deg,rgba(216,179,90,.18),rgba(111,60,255,.16))] p-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F0D98A]">Final OHI Output</p>
            <h3 className="mt-3 text-2xl font-black text-white">A governed answer should combine shared agreement, named uncertainty, adversarial objections, and a human-approved action checklist.</h3>
            <p className="mx-auto mt-4 max-w-3xl text-slate-200">For: “{question}” — the simulator recommends a synthesis that preserves oversight, records cross-model disagreement, and turns novel insights into reviewable next steps.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Stage({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return <section className="rounded-[2rem] border border-white/10 bg-black/30 p-4 md:p-6"><p className="text-xs font-black uppercase tracking-[0.28em] text-[#F0D98A]">{kicker}</p><h2 className="mt-2 text-2xl font-black text-white">{title}</h2><div className="mt-5">{children}</div></section>;
}

function OutputPanel({ output }: { output: OhiModelOutput }) {
  return <article className="rounded-3xl border border-[#D8B35A]/25 bg-[#030811]/80 p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#F0D98A]">{ohiProviderLabels[output.provider]}</p><h3 className="mt-2 font-black text-white">{output.modelName}</h3><p className="mt-3 text-sm text-slate-300">{output.summary}</p><ul className="mt-3 space-y-1 text-xs text-slate-400">{output.keyIdeas.map((idea) => <li key={idea}>• {idea}</li>)}</ul></article>;
}

function SignalList({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-3xl border border-[#6F3CFF]/30 bg-white/[0.055] p-4"><h3 className="font-black text-white">{title}</h3><ul className="mt-3 space-y-2 text-sm text-slate-300">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;
}
