import { platformCapabilities } from '@/config/platform-status';
import { PlatformStatusBadge } from './PlatformStatusBadge';

export function StatusGrid() {
  return <div className="public-card-grid">{platformCapabilities.map((item) => <article className="public-card" key={item.id}><PlatformStatusBadge status={item.status} /><h3>{item.name}</h3><p>{item.description}</p></article>)}</div>;
}
