'use client';

import { useState } from 'react';

type ArtifactResult = {
  declaration: string;
  seal: string;
  previewText: string;
};

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArtifactResult | null>(null);

  const submit = async (formData: FormData) => {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);

    if (!res.ok) {
      alert('Generation failed');
      return;
    }

    setResult(await res.json());
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={submit} className="card-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-gold">Create your identity assets</h1>
        <input name="fullName" required placeholder="Full name" className="w-full rounded-xl border border-gold/20 bg-black/40 p-3" />
        <input name="calling" required placeholder="Calling statement" className="w-full rounded-xl border border-gold/20 bg-black/40 p-3" />
        <textarea name="promise" required placeholder="Personal declaration promise" className="h-28 w-full rounded-xl border border-gold/20 bg-black/40 p-3" />
        <button className="w-full rounded-full bg-gold px-4 py-2 font-semibold text-black" disabled={loading}>
          {loading ? 'Generating...' : 'Generate free preview'}
        </button>
      </form>
      <div className="card-panel p-6">
        <h2 className="text-lg font-semibold">Preview output</h2>
        {result ? (
          <div className="mt-4 space-y-4 text-sm text-zinc-300">
            <p>{result.previewText}</p>
            <a href={result.declaration} className="text-gold underline">Declaration preview image</a>
            <a href={result.seal} className="block text-gold underline">Obsidian seal preview image</a>
          </div>
        ) : (
          <p className="mt-4 text-zinc-400">Generate to see free low-res preview. HD unlock happens after checkout.</p>
        )}
      </div>
    </div>
  );
}
