import { ModuleGrid } from '../../../components/module-grid';
import { getSession } from '../../../lib/auth';
import { ModuleCard } from '../../../lib/types';

export default async function Dashboard() {
  const s = await getSession();
  const modules: ModuleCard[] = [
    { slug: '/profile', title: 'Profile', description: 'User profile + membership', roles: ['user', 'member', 'admin'] },
    { slug: '/odin-registry', title: 'ODIN Registry', description: 'Browse ODIN records', roles: ['user', 'member', 'admin'] },
    { slug: '/planetary-registry', title: 'Planetary Registry', description: '25 ODIN-PR planets', roles: ['user', 'member', 'admin'] },
    { slug: '/admin', title: 'Admin Manager', description: 'Records and governance controls', roles: ['admin'] },
  ];

  return (
    <main>
      <h1 className="text-2xl">Dashboard</h1>
      <p>
        {s.email} ({s.role})
      </p>
      <ModuleGrid modules={modules} role={s.role} />
    </main>
  );
}
