const layers = [
  'Layer 0 Human Authority','Layer 1 Identity Authority','Layer 2 Control Plane','Layer 3 Systems Command Center','Layer 4 Orchestration','Layer 5 Execution Gateway','Layer 6 External Compute Adapters','Layer 7 Ledger / Verification','Layer 8 ODIN Registry','Layer 9 Interface Layer','Layer 10 Applications','Layer 11 Wallet / Finance','Layer 12 Cloud Infrastructure','Layer 13 Audit Grid','Layer 14 Expansion Layer'
];

export default function ArchitecturePage() {
  return <main className="space-y-4"><h1 className="text-3xl font-bold">OHI Multi-layer Architecture</h1><ol className="space-y-2">{layers.map((layer) => <li key={layer} className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">{layer}</li>)}</ol></main>;
}
