import OfferingCard from '@/components/OfferingCard';
const offerings=[{slug:'series-a',title:'Series A Record',status:'review' as const},{slug:'private-note',title:'Private Note Record',status:'pending' as const}];
export default function Offerings(){return <div className="space-y-4"><h1 className="text-2xl font-bold">Offerings</h1><div className="grid gap-4 md:grid-cols-2">{offerings.map(o=><OfferingCard key={o.slug} {...o} />)}</div></div>;}
