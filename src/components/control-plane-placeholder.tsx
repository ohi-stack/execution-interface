import { controlPlanePlaceholderLabels } from '@/lib/control-plane';

type ControlPlanePlaceholderProps = {
  title: string;
  description: string;
  layer: string;
  modules: string[];
};


export function ControlPlanePlaceholder({ title, description, layer, modules }: ControlPlanePlaceholderProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/30 bg-slate-950/80 p-6 text-slate-100 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <div className="flex flex-wrap gap-2">
        {controlPlanePlaceholderLabels.map((label) => (
          <span key={label} className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {label}
          </span>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">OneGodian App Control Plane</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 md:col-span-2">
          <h2 className="text-xl font-semibold text-white">Production-safe placeholder infrastructure</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This route reserves the {layer} control-plane surface without claiming active backend behavior. Integration points stay inactive until an authenticated admin service, verified data source, and audit workflow are connected.
          </p>
        </article>
        <article className="rounded-2xl border border-amber-400/30 bg-amber-950/30 p-5">
          <h2 className="text-xl font-semibold text-amber-100">No fake functionality</h2>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">
            Actions, metrics, records, mutations, and administrative controls are intentionally withheld when they are not already backed by production services.
          </p>
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-white">Planned module boundaries</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {modules.map((module) => (
            <li key={module} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <span className="font-semibold text-cyan-200">{module}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-500">Requires Admin Integration</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
