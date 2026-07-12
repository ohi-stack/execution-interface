import {
  agentTasks,
  algorithmCriteria,
  distillationFilters,
  modelLanes,
  pipelineStages,
  verificationChecks,
} from '@/data/pipeline';

export function PipelineFlow() {
  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-[#D8B35A]/25 bg-[#030811]/90 p-4 shadow-gold backdrop-blur md:p-6">
        <div className="relative aspect-video min-h-[520px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_18%_15%,rgba(216,179,90,.18),transparent_26rem),radial-gradient(circle_at_82%_20%,rgba(111,60,255,.25),transparent_28rem),linear-gradient(135deg,#02040a_0%,#071827_55%,#05010c_100%)] p-4 md:min-h-0 md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,217,138,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(111,60,255,.07)_1px,transparent_1px)] bg-[size:36px_36px] opacity-70" />
          <div className="absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-[#D8B35A]/20 blur-3xl" />
          <div className="absolute -right-20 top-16 h-52 w-52 rounded-full bg-[#6F3CFF]/25 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-[#F0D98A]">OHI multi-model governance sequence</p>
                <h3 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">How OHI uses multiple models to produce one governed output</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Runtime</p>
                <p className="text-lg font-black text-[#F0D98A]">60–90 sec</p>
                <p className="text-xs text-slate-400">16:9 master • 9:16 derivative</p>
              </div>
            </div>

            <div className="grid flex-1 items-center gap-4 md:grid-cols-[1fr_1.35fr_1fr]">
              <div className="ohi-pulse rounded-3xl border border-[#D8B35A]/40 bg-black/35 p-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">Scene 1</p>
                <h4 className="mt-2 text-2xl font-black text-white">Founder Input</h4>
                <p className="mt-3 text-sm text-slate-300">One source prompt enters the system.</p>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-4">
                  {modelLanes.map((lane, index) => (
                    <div key={lane.name} className="ohi-lane rounded-2xl border border-[#6F3CFF]/35 bg-white/[0.06] p-3" style={{ animationDelay: `${index * 180}ms` }}>
                      <p className="text-sm font-black text-white">{lane.name}</p>
                      <p className="mt-1 text-xs text-[#F0D98A]">{lane.role}</p>
                      <div className="mt-3 grid grid-cols-2 gap-1">
                        {agentTasks.map((task) => <span key={task} className="rounded-full bg-black/30 px-2 py-1 text-[10px] text-slate-300">{task}</span>)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <ProcessCard title="GCD Distillation" label="Scene 4" items={distillationFilters} footer="Shared signal retained" />
                  <ProcessCard title="Algorithm Evaluation" label="Scene 5" items={algorithmCriteria} footer="Candidate outputs scored" />
                  <ProcessCard title="Verification Gate" label="Scene 6" items={verificationChecks} footer="Requirements confirmed" />
                </div>
              </div>

              <div className="rounded-3xl border border-[#D8B35A]/45 bg-[linear-gradient(135deg,rgba(216,179,90,.18),rgba(111,60,255,.16))] p-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">Scene 7</p>
                <h4 className="mt-2 text-2xl font-black text-white">Governed Output</h4>
                <p className="mt-4 text-lg font-black leading-relaxed text-white">One input.<br />Multiple perspectives.<br />One verified result.</p>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-7">
              {pipelineStages.map((stage, i) => (
                <div key={stage} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                  <p className="text-[10px] font-black text-[#F0D98A]">0{i + 1}</p>
                  <h5 className="mt-1 text-xs font-black text-white">{stage}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-sm rounded-[2rem] border border-[#6F3CFF]/30 bg-black/35 p-4 md:hidden">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">9:16 derivative stack</p>
        <div className="mt-4 space-y-3">
          {pipelineStages.map((stage, i) => <div key={stage} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3"><span className="text-xs text-[#F0D98A]">0{i + 1}</span><p className="font-black text-white">{stage}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ title, label, items, footer }: { title: string; label: string; items: string[]; footer: string }) {
  return (
    <div className="rounded-2xl border border-[#D8B35A]/20 bg-black/35 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F0D98A]">{label}</p>
      <h4 className="mt-1 font-black text-white">{title}</h4>
      <div className="mt-2 flex flex-wrap gap-1">
        {items.map((item) => <span key={item} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-300">{item}</span>)}
      </div>
      <p className="mt-3 text-xs font-bold text-[#F0D98A]">{footer}</p>
    </div>
  );
}
