import { Planet } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';

export function PlanetCard({ planet, onOpen }: { planet: Planet; onOpen: () => void }) {
  return <button className={styles.card} onClick={onOpen} aria-label={`Open ${planet.name} details`}><div>{planet.id}</div><h3>{planet.name}</h3><p>{planet.tier}</p><p>{planet.valuation}</p></button>;
}
