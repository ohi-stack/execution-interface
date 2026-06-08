import { authorityServices } from '@/lib/acc-content';
import { StatusBadge } from '@/components/StatusBadge';

export function AuthorityGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {authorityServices.map((service) => (
        <article key={service.key} className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-black text-white">{service.name}</h3>
            <StatusBadge status={service.ownership} />
          </div>
          <p className="mt-4 text-sm leading-6 text-cyan-50/80">{service.role}</p>
        </article>
      ))}
    </div>
  );
}
