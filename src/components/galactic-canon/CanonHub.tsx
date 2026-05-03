import { ATLAS, CANON_CATEGORIES, CanonEntry, CanonFilter, Planet } from '@/lib/galactic-canon';
import { PlanetCard } from './PlanetCard';
import styles from './galactic-canon.module.css';

const filters: { label: string; value: CanonFilter }[] = [
  { label: 'All Worlds', value: 'all' },
  { label: 'Inner Crown', value: 'inner' },
  { label: 'Middle Song', value: 'middle' },
  { label: 'Outer Veil', value: 'outer' },
  { label: 'Species', value: 'beings' },
  { label: 'Realms', value: 'realms' },
  { label: 'Satellites', value: 'satellites' },
  { label: 'Lineages', value: 'lineages' },
  { label: 'Figures', value: 'figures' },
  { label: 'Temporal', value: 'temporal' },
  { label: 'Cosmology', value: 'cosmology' },
  { label: 'Canon', value: 'canon' }
];

export function CanonHub({
  activeFilter,
  setActiveFilter,
  openPlanet,
  openEntry
}: {
  activeFilter: CanonFilter;
  setActiveFilter: (filter: CanonFilter) => void;
  openPlanet: (planet: Planet) => void;
  openEntry: (entry: CanonEntry) => void;
}) {
  const planets = ATLAS.filter(
    (planet) =>
      activeFilter === 'all' ||
      (activeFilter === 'inner' && planet.tier === 'Inner Crown') ||
      (activeFilter === 'middle' && planet.tier === 'Middle Song') ||
      (activeFilter === 'outer' && planet.tier === 'Outer Veil') ||
      activeFilter === 'satellites'
  );
  const entries = CANON_CATEGORIES.find((category) => category.id === activeFilter)?.entries ?? [];

  return (
    <section>
      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`${styles.btn} ${activeFilter === filter.value ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter.value)}
            aria-label={`Filter ${filter.label}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {['all', 'inner', 'middle', 'outer', 'satellites'].includes(activeFilter)
          ? planets.map((planet) => <PlanetCard key={planet.id} planet={planet} onOpen={() => openPlanet(planet)} />)
          : entries.map((entry) => (
              <button key={entry.id} className={styles.card} onClick={() => openEntry(entry)}>
                <strong>{entry.name}</strong>
                <p>{entry.id}</p>
              </button>
            ))}
      </div>
    </section>
  );
}
