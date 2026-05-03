import { CanonEntry } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';

export function GenericCanonDetail({ entry, onBack }: { entry: CanonEntry; onBack: () => void }) {
  return (
    <section>
      <button className={styles.btn} onClick={onBack}>Back to Hub</button>
      <h2>{entry.name}</h2>
      <p>{entry.id} · {entry.valuation}</p>
      <p>{entry.description}</p>
    </section>
  );
}
