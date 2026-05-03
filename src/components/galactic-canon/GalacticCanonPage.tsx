'use client';
import { useMemo, useState } from 'react';
import { CanonEntry, CanonFilter, Moon, Planet } from '@/lib/galactic-canon';
import styles from './galactic-canon.module.css';
import { CanonHub } from './CanonHub';
import { PlanetDetail } from './PlanetDetail';
import { GenericCanonDetail } from './GenericCanonDetail';
import { SatelliteDetail } from './SatelliteDetail';

type View = 'hub' | 'planet' | 'generic' | 'satellite';
export function GalacticCanonPage(){
  const [currentView,setCurrentView]=useState<View>('hub'); const [activeFilter,setActiveFilter]=useState<CanonFilter>('all');
  const [selectedPlanet,setSelectedPlanet]=useState<Planet|null>(null); const [selectedEntry,setSelectedEntry]=useState<CanonEntry|null>(null); const [selectedMoon,setSelectedMoon]=useState<Moon|null>(null);
  const [sidebarOpen,setSidebarOpen]=useState(false); const [warpActive,setWarpActive]=useState(false);
  const openPlanet=(p:Planet)=>{setSelectedPlanet(p);setCurrentView('planet');setWarpActive(true);};
  const openEntry=(e:CanonEntry)=>{setSelectedEntry(e);setCurrentView('generic');setWarpActive(true);};
  const openMoon=(m:Moon)=>{setSelectedMoon(m);setCurrentView('satellite')};
  const cls = useMemo(()=>`${styles.content} ${warpActive?styles.warp:''}`,[warpActive]);
  return <main className={styles.page}><div className={styles.stars}/><div className={styles.wrap}><button className={styles.mobileBtn+' '+styles.btn} onClick={()=>setSidebarOpen(v=>!v)}>Menu</button><aside className={`${styles.sidebar} ${sidebarOpen?styles.sidebarOpen:''}`}><h1>Onegodian™ Sovereign Galactic Canon</h1><p>Internal Creative Canon • ODIN-PR Registry Interface • Application-Layer Atlas</p><p>The OneGodian™ Sovereign Galactic Canon is an internal creative, educational, cultural, and intellectual-property registry interface. It does not assert civil governmental authority, territorial jurisdiction over non-members, or exemption from applicable law.</p></aside><section className={cls}>{currentView==='hub'&&<CanonHub activeFilter={activeFilter} setActiveFilter={setActiveFilter} openPlanet={openPlanet} openEntry={openEntry}/>} {currentView==='planet'&&selectedPlanet&&<PlanetDetail planet={selectedPlanet} onBack={()=>setCurrentView('hub')} onMoon={openMoon}/>} {currentView==='generic'&&selectedEntry&&<GenericCanonDetail entry={selectedEntry} onBack={()=>setCurrentView('hub')}/>} {currentView==='satellite'&&selectedMoon&&<SatelliteDetail moon={selectedMoon} onBack={()=>setCurrentView('planet')}/>}</section></div></main>
}
