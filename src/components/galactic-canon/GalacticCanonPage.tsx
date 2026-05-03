'use client';

import { useMemo, useState } from 'react';
import { CanonEntry, CanonFilter, Moon, Planet } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';
import { CanonHub } from './CanonHub';
import { PlanetDetail } from './PlanetDetail';
import { GenericCanonDetail } from './GenericCanonDetail';
import { SatelliteDetail } from './SatelliteDetail';

type View = 'hub' | 'planet' | 'generic' | 'satellite';

export function GalacticCanonPage() {
  const [currentView, setCurrentView] = useState<View>('hub');
  const [activeFilter, setActiveFilter] = useState<CanonFilter>('all');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CanonEntry | null>(null);
  const [selectedMoon, setSelectedMoon] = useState<Moon | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openPlanet = (planet: Planet) => {
    setSelectedPlanet(planet);
    setCurrentView('planet');
    setSidebarOpen(false);
  };

  const openEntry = (entry: CanonEntry) => {
    setSelectedEntry(entry);
    setCurrentView('generic');
    setSidebarOpen(false);
  };

  const openMoon = (moon: Moon) => {
    setSelectedMoon(moon);
    setCurrentView('satellite');
  };

  const contentClassName = useMemo(() => `${styles.content}`, []);

  return (
    <main className={styles.page}>
      <div className={styles.stars} />
      <div className={styles.wrap}>
        <button
          className={`${styles.mobileBtn} ${styles.btn}`}
          onClick={() => setSidebarOpen((value) => !value)}
          aria-expanded={sidebarOpen}
          aria-controls="galactic-canon-sidebar"
        >
          {sidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>

        <aside id="galactic-canon-sidebar" className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <h1>OneGodian Galaxy™ — Galactic Canon Hub</h1>
          <p>Internal creative atlas • educational registry surface • application-layer reference map</p>
          <p>
            Compliance note: this page is an internal cultural and intellectual-property registry interface. It does
            not claim civil governmental authority, external territorial jurisdiction, or exemption from applicable law.
          </p>
        </aside>

        <section className={contentClassName}>
          {currentView === 'hub' && (
            <CanonHub
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              openPlanet={openPlanet}
              openEntry={openEntry}
            />
          )}
          {currentView === 'planet' && selectedPlanet && (
            <PlanetDetail planet={selectedPlanet} onBack={() => setCurrentView('hub')} onMoon={openMoon} />
          )}
          {currentView === 'generic' && selectedEntry && (
            <GenericCanonDetail entry={selectedEntry} onBack={() => setCurrentView('hub')} />
          )}
          {currentView === 'satellite' && selectedMoon && (
            <SatelliteDetail moon={selectedMoon} onBack={() => setCurrentView('planet')} />
          )}
        </section>
      </div>
    </main>
  );
}
