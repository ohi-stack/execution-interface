import Link from 'next/link';
import { ChecklistCard, ModuleHeader, PriorityBadge, StatusBadge } from '@/components/module-ui';

const layers = [
  { title: 'Protocol Layer', href: '/algorithm/protocol', description: 'Recognition and classification standards for AI-safe OneGodian identity handling.' },
  { title: 'Experience Layer', href: '/algorithm/experience', description: 'Belief Mapper and personalization models that adapt with explicit user consent.' },
  { title: 'Community Layer', href: '/algorithm/community', description: 'Community intelligence and matching logic for aligned member pathways.' },
  { title: 'Orientation Layer', href: '/algorithm/orientation', description: 'Behavioral orientation standards for AI agents, robotics, and automated systems.' }
];

export default function AlgorithmPage() {
  return <main className='space-y-6'>
    <ModuleHeader title='Onegodian Algorithm™' description='Four-layer AI governance framework for Protocol, Experience, Community, and Orientation.' cta={<div className='flex gap-2'><StatusBadge status='In Development' /><PriorityBadge priority='Critical' /></div>} />
    <div className='grid gap-4 md:grid-cols-2'>{layers.map((l)=><Link key={l.href} href={l.href} className='rounded-xl border border-slate-700 bg-slate-900/60 p-5 hover:border-cyan-400/70'><h2 className='text-xl font-semibold'>{l.title}</h2><p className='mt-2 text-sm text-slate-300'>{l.description}</p></Link>)}</div>
    <ChecklistCard items={['Create /algorithm landing page','Add four-layer visual architecture','Add downloadable white paper link','Add API-ready endpoint structure','Add institutional-safe definitions']} />
  </main>;
}
