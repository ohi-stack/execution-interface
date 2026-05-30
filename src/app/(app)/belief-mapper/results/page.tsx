import { ResultCard } from '@/components/belief-mapper/ResultCard';
import { EmailCaptureForm } from '@/components/belief-mapper/EmailCaptureForm';
import { beliefMapperResults } from '@/lib/beliefMapper/scoring';

export default function BeliefMapperResultsPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Result pathways</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Belief Mapper™ result library</h1>
        <p className="mt-3 text-slate-300">Each profile routes to a next step without claiming permanence. Revisit the mapper whenever your season changes.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">{beliefMapperResults.map((result) => <ResultCard key={result.id} result={result} />)}</div>
      <EmailCaptureForm />
    </main>
  );
}
