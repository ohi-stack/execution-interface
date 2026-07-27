import { utilityCategories } from '@/config/platform-status';
import { PlatformStatusBadge } from './PlatformStatusBadge';

export function UtilityGrid() {
  return <div className="public-card-grid utility-cards">{utilityCategories.map((item) => <article className="public-card" key={item.name}><PlatformStatusBadge status={item.status} /><h3>{item.name}</h3><p>{item.description}</p></article>)}</div>;
}
