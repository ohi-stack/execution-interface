import Link from 'next/link';
import { ModuleCard, Role } from '../lib/types';
import { canAccess } from '../lib/auth';

export function ModuleGrid({ modules, role }: { modules: ModuleCard[]; role: Role }) {
  return <div className="grid gap-4 md:grid-cols-2">{modules.map((m)=><Link key={m.slug} href={m.slug} className="rounded border border-slate-700 p-4"><h3>{m.title}</h3><p>{m.description}</p><p className="text-xs">Access: {canAccess(m.roles, role)?'granted':'restricted'}</p></Link>)}</div>;
}
