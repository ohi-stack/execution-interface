type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="glass-panel p-6 sm:p-8 lg:p-10">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">{eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2.4rem,7vw,5.2rem)] font-black leading-[0.92] tracking-[-0.06em] text-white">{title}</h1>
      <p className="mt-5 max-w-4xl text-lg font-semibold leading-8 text-slate-200">{description}</p>
    </section>
  );
}
