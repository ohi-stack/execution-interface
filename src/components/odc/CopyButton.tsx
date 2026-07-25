'use client';
import { useState } from 'react';
export function CopyButton({value,label='Copy'}:{value:string;label?:string}){const [copied,setCopied]=useState(false);async function copy(){await navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1800)}return <button type="button" className="copy-button" onClick={copy} aria-live="polite">{copied?'Copied':label}</button>}
