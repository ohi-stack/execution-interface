import { ATLAS, CANON_CATEGORIES, CanonEntry, CanonFilter, Planet } from '@/lib/galactic-canon';import { PlanetCard } from './PlanetCard';import styles from './galactic-canon.module.css';

const filters: {label:string;value:CanonFilter}[] = [
  {label:'All Worlds',value:'all'},{label:'Inner Crown',value:'inner'},{label:'Middle Song',value:'middle'},{label:'Outer Veil',value:'outer'},{label:'Species',value:'beings'},{label:'Realms',value:'realms'},{label:'Satellites',value:'satellites'},{label:'Lineages',value:'lineages'},{label:'Figures',value:'figures'},{label:'Temporal',value:'temporal'},{label:'Cosmology',value:'cosmology'},{label:'Canon',value:'canon'}
];
export function CanonHub({activeFilter,setActiveFilter,openPlanet,openEntry}:{activeFilter:CanonFilter;setActiveFilter:(f:CanonFilter)=>void;openPlanet:(p:Planet)=>void;openEntry:(e:CanonEntry)=>void}){
 const planets=ATLAS.filter(p=>activeFilter==='all'||(activeFilter==='inner'&&p.tier==='Inner Crown')||(activeFilter==='middle'&&p.tier==='Middle Song')||(activeFilter==='outer'&&p.tier==='Outer Veil')||(activeFilter==='satellites'));
 const entries=CANON_CATEGORIES.find(c=>c.id===activeFilter)?.entries??[];
 return <section><div className={styles.filters}>{filters.map(f=><button key={f.value} className={`${styles.btn} ${activeFilter===f.value?styles.active:''}`} onClick={()=>setActiveFilter(f.value)} aria-label={`Filter ${f.label}`}>{f.label}</button>)}</div><div className={styles.grid}>{(activeFilter==='all'||activeFilter==='inner'||activeFilter==='middle'||activeFilter==='outer'||activeFilter==='satellites')?planets.map(p=><PlanetCard key={p.id} planet={p} onOpen={()=>openPlanet(p)}/>):entries.map(e=><button key={e.id} className={styles.card} onClick={()=>openEntry(e)}>{e.name}<p>{e.id}</p></button>)}</div></section>
}
