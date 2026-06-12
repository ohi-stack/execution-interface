export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">{eyebrow}</p>
      <h1 className="mt-3 break-words text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </section>
  );
}
