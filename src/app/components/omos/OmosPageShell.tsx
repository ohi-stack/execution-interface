import Link from 'next/link';
import styles from './omos-page.module.css';

export default function OmosPageShell({ title, summary }: { title: string; summary: string }) {
  const links = ['/', '/omos', '/protocol', '/algorithm', '/ohi', '/docs', '/tools', '/artifacts', '/manifest'];
  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.card}>
          <p>OMOS Runtime</p>
          <h1 className={styles.title}>{title}</h1>
          <p>{summary}</p>
          <div className={styles.links}>
            {links.map((href) => (
              <Link key={href} href={href} className={styles.link}>{href}</Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
