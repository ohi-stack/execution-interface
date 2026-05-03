import { Planet } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';

export function PlanetDetail({ planet, onBack, onMoon }: { planet: Planet; onBack: () => void; onMoon: (m: Planet['moons'][number]) => void }) {
  return <section><button className={styles.btn} onClick={onBack} aria-label="Back to canon hub">Back to Hub</button><h2>{planet.name}</h2><div className={styles.ring}>{planet.ringType}</div><p>{planet.description}</p><p>Surface: {planet.surface} · Atmosphere: {planet.atmosphere} · Texture: {planet.textureType}</p><h3>Satellites</h3>{planet.moons.map((m)=><button key={m.id} className={styles.card} onClick={()=>onMoon(m)} aria-label={`Open moon ${m.name}`}>{m.name} ({m.designation})</button>)}</section>;
}
