import { ConsolePage } from '@/components/ConsolePage';
import { contributorNotice, contributorTiers } from '@/lib/acc-content';

export default function Page() {
  return (
    <ConsolePage href="/contributors">
      <p>Contributors support ONEGODIAN, LLC public-facing products, education, media, technology, membership, and community infrastructure.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {contributorTiers.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4">
            <p className="font-black text-white">{tier.name}</p>
            <p className="mt-1 text-2xl font-black text-amber-100">{tier.amount}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl border border-purple-300/30 bg-purple-400/10 p-4 font-semibold text-purple-50">{contributorNotice}</p>
    </ConsolePage>
  );
}
