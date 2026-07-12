'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <button type="button" onClick={copy} className="rounded-full border border-[#D8B35A]/40 bg-[#D8B35A]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#F0D98A] transition hover:bg-[#D8B35A]/20">{copied ? 'Copied' : 'Copy'}</button>;
}
