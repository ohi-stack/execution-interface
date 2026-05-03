import { Moon } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';

export function SatelliteDetail({ moon, onBack }: { moon: Moon; onBack: () => void }) {
  return (
    <section>
      <button className={styles.btn} onClick={onBack}>Back to Planet</button>
      <h2>{moon.name}</h2>
      <p>{moon.id} · {moon.designation}</p>
      <div className={styles.ring}>Orbit band: {moon.orbitBand}</div>
      <p>{moon.description}</p>
    </section>
  );
}
