import Link from 'next/link';

type LayerCardProps = {
  title: string;
  description?: string;
  href?: string;
  items?: string[];
  eyebrow?: string;
};

export function LayerCard({ title, description, href, items, eyebrow }: LayerCardProps) {
  const content = (
    <article className="mobile-card h-full">
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-200">{eyebrow}</p> : null}
      <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">{title}</h3>
      {description ? <p className="mt-3 leading-7 text-slate-300">{description}</p> : null}
      {items ? (
        <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-300">
          {items.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      ) : null}
      {href ? <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-gold-200">Open →</span> : null}
    </article>
  );

  return href ? <Link href={href} className="block h-full">{content}</Link> : content;
}
