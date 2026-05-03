type ModuleCardProps = { title: string; description: string; href?: string };

export function ModuleCard({ title, description, href = '#' }: ModuleCardProps) {
  return (
    <a href={href} className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5 hover:border-neon">
      <h3 className="text-lg font-semibold text-neon">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </a>
  );
}
