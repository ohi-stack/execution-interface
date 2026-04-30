import Image from 'next/image';
import Link from 'next/link';

type CapitalImagePanelProps = {
  title: string;
  description: string;
  src?: string;
  alt: string;
  href?: string;
  badge?: string;
};

export default function CapitalImagePanel({ title, description, src, alt, href, badge }: CapitalImagePanelProps) {
  const content = (
    <article className="capital-image-panel card">
      {badge ? <p className="eyebrow">{badge}</p> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="capital-image-frame">
        {src ? (
          <Image src={src} alt={alt} width={1600} height={900} />
        ) : (
          <div className="capital-image-placeholder" role="img" aria-label={alt}>
            <p>Visual asset placeholder</p>
            <small>Image can be configured later without affecting portal functionality.</small>
          </div>
        )}
      </div>
    </article>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
