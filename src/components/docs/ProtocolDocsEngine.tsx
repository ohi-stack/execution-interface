import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyButton } from '@/components/docs/CopyButton';
import { PdfDownloadButton } from '@/components/docs/PdfDownloadButton';
import { getProtocolDoc, protocolDocs, type ProtocolDoc } from '@/lib/protocol-docs';

type Heading = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/™/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function stripMarkdown(value: string) {
  return value.replace(/\*\*/g, '').replace(/`/g, '');
}

function parseHeadings(markdown: string): Heading[] {
  return markdown
    .split('\n')
    .filter((line) => /^#{1,3}\s/.test(line))
    .map((line) => {
      const level = line.match(/^#+/)?.[0].length ?? 2;
      const text = stripMarkdown(line.replace(/^#{1,3}\s/, ''));
      return { id: slugify(text), text, level: Math.min(level, 3) as 1 | 2 | 3 };
    });
}

function renderInline(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`} className="font-bold text-gold-100">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`} className="rounded bg-white/10 px-1.5 py-0.5 text-gold-100">{part.slice(1, -1)}</code>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderMarkdown(markdown: string) {
  const blocks: JSX.Element[] = [];
  const lines = markdown.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      const code = codeLines.join('\n');
      blocks.push(
        <div key={`code-${index}`} className="group relative my-6 overflow-hidden rounded-2xl border border-gold-300/20 bg-black/45 shadow-sovereign">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>{language}</span>
            <CopyButton value={code} label="Copy" />
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6 text-gold-100"><code>{code}</code></pre>
        </div>
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 2;
      const text = stripMarkdown(line.replace(/^#{1,3}\s/, ''));
      const id = slugify(text);
      const Tag = (`h${Math.min(level, 3)}` as keyof JSX.IntrinsicElements);
      const classes = level === 1
        ? 'mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl'
        : level === 2
          ? 'mt-10 scroll-mt-32 text-2xl font-black tracking-[-0.02em] text-white'
          : 'mt-8 scroll-mt-32 text-xl font-bold text-gold-100';
      blocks.push(
        <Tag key={`heading-${id}-${index}`} id={id} className={classes}>
          {text}
          {level > 1 ? <a href={`#${id}`} className="ml-2 text-gold-300/55 no-underline hover:text-gold-200">#</a> : null}
        </Tag>
      );
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${index}`} className="my-5 space-y-3 pl-0">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-300 shadow-gold" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^#{1,3}\s/.test(lines[index]) && !lines[index].startsWith('- ') && !lines[index].startsWith('```')) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    const paragraph = paragraphLines.join(' ');
    blocks.push(
      <p key={`paragraph-${index}`} className="mt-5 text-base leading-8 text-slate-300">
        {renderInline(paragraph)}
      </p>
    );
  }

  return blocks;
}

export function ProtocolDocsEngine({ slug }: { slug: string }) {
  const doc = getProtocolDoc(slug);

  if (!doc) {
    notFound();
  }

  const headings = parseHeadings(doc.markdown);

  return (
    <main className="docs-engine-grid grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="glass-panel overflow-hidden p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Docs Engine</p>
          <nav className="mt-4 space-y-2" aria-label="Documentation routes">
            {protocolDocs.map((item) => (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                className={`block rounded-2xl border px-4 py-3 text-sm transition ${item.slug === doc.slug ? 'border-gold-300/55 bg-gold-300/12 text-gold-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-purple-300/40 hover:text-white'}`}
              >
                <span className="block font-bold">{item.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{item.version} · {item.status}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 rounded-3xl border border-purple-300/20 bg-purple-300/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-100">On this page</p>
          <nav className="mt-3 space-y-2" aria-label="Section anchors">
            {headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`} className={`block text-sm text-slate-300 hover:text-gold-200 ${heading.level === 3 ? 'pl-4' : ''}`}>
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <article className="glass-panel overflow-hidden">
        <header className="border-b border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge>{doc.version}</Badge>
            <Badge>{doc.status}</Badge>
            <Badge>Source: {doc.source}</Badge>
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.32em] text-gold-300">{doc.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">{doc.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{doc.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PdfDownloadButton label={doc.pdfLabel} />
            <CopyButton value={doc.markdown} label="Copy Markdown" className="px-5 py-3" />
          </div>
          <p className="mt-4 text-xs text-slate-500">Updated {doc.updated}. PDF CTA opens the browser print dialog for save-as-PDF workflows.</p>
        </header>
        <div className="docs-markdown p-6 sm:p-8">
          {renderMarkdown(doc.markdown)}
        </div>
      </article>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold-100">{children}</span>;
}

export function getProtocolDocMetadata(slug: string): Pick<ProtocolDoc, 'title' | 'description'> | undefined {
  const doc = getProtocolDoc(slug);
  if (!doc) return undefined;
  return { title: doc.title, description: doc.description };
}
