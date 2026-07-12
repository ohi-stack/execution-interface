import { CopyButton } from './CopyButton';

type Block = { type: 'heading'; depth: number; text: string } | { type: 'paragraph'; text: string } | { type: 'list'; items: string[]; ordered: boolean } | { type: 'code'; code: string; language: string };

export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export function getHeadings(markdown: string) {
  return markdown.split('\n').filter((line) => /^#{2,3}\s/.test(line)).map((line) => {
    const text = line.replace(/^#{2,3}\s/, '').trim();
    return { id: slugify(text), text };
  });
}

function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.split('\n');
  const blocks: Block[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    if (line.startsWith('```')) {
      const language = line.replace('```', '').trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) { code.push(lines[index]); index += 1; }
      blocks.push({ type: 'code', code: code.join('\n'), language });
    } else if (/^#{1,3}\s/.test(line)) {
      const depth = line.match(/^#+/)?.[0].length ?? 1;
      blocks.push({ type: 'heading', depth, text: line.replace(/^#{1,3}\s/, '').trim() });
    } else if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items = [line.replace(/^([-*]|\d+\.)\s/, '')];
      while (index + 1 < lines.length && (ordered ? /^\d+\.\s/.test(lines[index + 1]) : /^[-*]\s/.test(lines[index + 1]))) {
        index += 1;
        items.push(lines[index].replace(/^([-*]|\d+\.)\s/, ''));
      }
      blocks.push({ type: 'list', ordered, items });
    } else {
      const text = [line.trim()];
      while (index + 1 < lines.length && lines[index + 1].trim() && !/^#{1,3}\s/.test(lines[index + 1]) && !/^[-*]\s/.test(lines[index + 1]) && !/^\d+\.\s/.test(lines[index + 1]) && !lines[index + 1].startsWith('```')) {
        index += 1;
        text.push(lines[index].trim());
      }
      blocks.push({ type: 'paragraph', text: text.join(' ') });
    }
  }
  return blocks;
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return <div className="space-y-6">{parseMarkdown(markdown).map((block, index) => {
    if (block.type === 'heading') {
      const Tag = block.depth === 1 ? 'h1' : block.depth === 2 ? 'h2' : 'h3';
      const id = slugify(block.text);
      const classes = block.depth === 1 ? 'text-4xl font-black text-white md:text-6xl' : block.depth === 2 ? 'scroll-mt-28 border-t border-white/10 pt-8 text-3xl font-black text-white' : 'scroll-mt-28 text-2xl font-black text-[#F0D98A]';
      return <Tag id={id} key={`${id}-${index}`} className={classes}><a href={`#${id}`} className="hover:text-[#F0D98A]">{block.text}</a></Tag>;
    }
    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';
      return <List key={index} className={`space-y-3 text-slate-300 ${block.ordered ? 'list-decimal' : 'list-disc'} pl-6`}>{block.items.map((item) => <li key={item} className="pl-2 leading-7">{item}</li>)}</List>;
    }
    if (block.type === 'code') return <div key={index} className="overflow-hidden rounded-3xl border border-[#D8B35A]/30 bg-black/50"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400"><span>{block.language || 'code'}</span><CopyButton text={block.code} /></div><pre className="overflow-x-auto p-5 text-sm leading-7 text-[#F0D98A]"><code>{block.code}</code></pre></div>;
    return <p key={index} className="text-lg leading-8 text-slate-300">{block.text}</p>;
  })}</div>;
}
