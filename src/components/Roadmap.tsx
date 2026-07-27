import { PlatformStatusBadge } from './PlatformStatusBadge';

const phases = [
  ['Foundation', 'Live', 'Canonical token record and public information portal.'],
  ['Platform', 'In Development', 'Core application and WordPress bridge validation.'],
  ['Utility pilots', 'Planned', 'Controlled pilots for approved categories.'],
  ['Expansion review', 'Under Review', 'Payments and broader integrations require review.'],
] as const;
export function Roadmap() { return <ol className="public-roadmap">{phases.map(([name, status, copy], index) => <li key={name}><span className="roadmap-number">0{index + 1}</span><PlatformStatusBadge status={status} /><h3>{name}</h3><p>{copy}</p></li>)}</ol>; }
