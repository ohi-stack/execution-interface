'use client';

import { useState } from 'react';

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className={`rounded-full border border-gold-300/35 bg-gold-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold-100 transition hover:border-gold-300/70 hover:bg-gold-300/20 ${className}`}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
