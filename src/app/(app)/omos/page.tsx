const omosModules = [
  'Identity & Consciousness Layer',
  'Belief Mapping & Meaning Layer',
  'Ethics, Responsibility, and Conduct Layer',
  'Language, Ritual, and Cultural Signal Layer',
  'Application, Protocol, and Runtime Layer'
];

export default function Page() {
  return <main className="space-y-6"><h1 className="text-3xl font-bold">OMOS · OneGodian Metaphysical Operating System</h1><p className="text-slate-300">OMOS organizes OneGodian operations into interoperable layers that bridge thought, language, governance, and deployable application behavior.</p><ul className="list-disc space-y-2 pl-5 text-slate-300">{omosModules.map((m) => <li key={m}>{m}</li>)}</ul><p className="text-sm text-slate-400">Manifest/API visibility: this route is registered in the public manifest and available to dashboard, admin monitoring, and app status surfaces.</p></main>;
export default function OmosPage() {
  const omosMindMap = [
    'Identity architecture and remembrance framework',
    'Consciousness alignment protocol layers',
    'Ethics, reflection, and participation modules',
    'Public app and dashboard synchronization',
    'Manifest/API interoperability for ecosystem apps'
  ];

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">OMOS · OneGodian Metaphysical Operating System</h1>
      <p className="text-slate-300">OMOS content maps metaphysical operating concepts into practical app modules, governance boundaries, and platform synchronization.</p>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {omosMindMap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
