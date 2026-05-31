import Link from 'next/link';

const templateTypes = [
  {
    title: 'Purchase Agreement templates',
    description: 'Start from reusable asset, real estate, business, or custom deal templates with clause libraries and approval checkpoints.'
  },
  {
    title: 'LOI generator',
    description: 'Generate letter-of-intent drafts from deal terms, buyer objectives, contingencies, timelines, and diligence requirements.'
  },
  {
    title: 'Seller-financing offers',
    description: 'Model down payments, notes, amortization, balloon payments, interest terms, security language, and fallback structures.'
  }
];

const workflowSteps = [
  'Collect deal profile, parties, asset details, price, deposit, close date, contingencies, and jurisdiction notes.',
  'Map terms into controlled merge fields so every draft uses the same source-of-truth deal data.',
  'Select LOI, purchase agreement, or seller-financing package and preview required clauses.',
  'Generate PDF-ready offer packets with draft status, revision number, and reviewer notes.',
  'Preserve version history so teams can compare redlines, accepted terms, and sent offers.'
];

const mergeFields = [
  'Buyer name',
  'Seller name',
  'Deal name',
  'Purchase price',
  'Earnest money',
  'Closing date',
  'Financing terms',
  'Inspection period',
  'Due diligence items',
  'Included assets',
  'Excluded assets',
  'Offer expiration'
];

const outputControls = [
  { label: 'PDF generation', value: 'Offer packet, signature copy, and internal review copy' },
  { label: 'Version history', value: 'Drafts, sent offers, counteroffers, accepted revisions' },
  { label: 'Deal merge fields', value: 'Structured terms reused across templates and exports' }
];

export const metadata = {
  title: 'OneGodian App | Offer Generator',
  description: 'Generate LOIs, purchase agreements, seller-financing offers, PDFs, version history, and deal merge fields.'
};

export default function OfferGeneratorPage() {
  return (
    <main className="space-y-6 text-slate-100">
      <section className="rounded-2xl border border-gold-300/30 bg-slate-950/80 p-6 shadow-gold">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Deal Tools</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">Offer Generator</h1>
            <p className="mt-3 max-w-4xl leading-7 text-slate-300">
              Build transaction-ready offer drafts from structured deal data, then package LOIs, purchase agreements, seller-financing terms,
              PDF exports, and revision history into one controlled workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-bold text-white">Primary use</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Move from deal intake to reviewable offer packet without retyping terms across documents.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {templateTypes.map((template) => (
          <article key={template.title} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="text-lg font-bold text-white">{template.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{template.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-6">
          <h2 className="text-xl font-black text-white">Generation workflow</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {workflowSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold-300/50 bg-gold-300/10 text-xs font-black text-gold-100">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
          <h2 className="text-xl font-black text-white">Output controls</h2>
          <div className="mt-4 space-y-3">
            {outputControls.map((control) => (
              <div key={control.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-gold-100">{control.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{control.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-200">Deal merge fields</p>
            <h2 className="mt-2 text-xl font-black text-white">Reusable source-of-truth fields</h2>
          </div>
          <Link href="/tools" className="rounded-full border border-gold-300/50 bg-gold-300/10 px-4 py-2 text-sm font-bold text-gold-100 transition hover:bg-gold-300/20">
            Back to Tools
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mergeFields.map((field) => (
            <span key={field} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
              {field}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
