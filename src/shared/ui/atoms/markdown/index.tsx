import { Fragment, JSX } from 'react';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let key = 0;
  const re = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]?.startsWith('**')) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<code key={key++}>{match[3]}</code>);
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  const lines = children.split('\n');
  const elements: JSX.Element[] = [];
  let inCode = false;
  let buf: string[] = [];

  const flushCode = () => {
    if (buf.length) {
      elements.push(<pre key={elements.length}><code>{buf.join('\n')}</code></pre>);
      buf = [];
    }
  };

  for (const raw of lines) {
    const s = raw.trimEnd();

    if (s.startsWith('```')) {
      if (inCode) { inCode = false; flushCode(); }
      else { inCode = true; }
      continue;
    }

    if (inCode) { buf.push(escapeHtml(raw)); continue; }

    if (s === '') { elements.push(<br key={elements.length} />); continue; }

    if (s.startsWith('## ')) {
      elements.push(<h3 key={elements.length}>{renderInline(s.slice(3))}</h3>);
      continue;
    }

    if (s.startsWith('**') && s.endsWith('**') && s.length > 4) {
      elements.push(<h4 key={elements.length}>{renderInline(s.slice(2, -2))}</h4>);
      continue;
    }

    if (s.startsWith('- ')) {
      elements.push(<li key={elements.length}>{renderInline(s.slice(2))}</li>);
      continue;
    }

    elements.push(<p key={elements.length}>{renderInline(s)}</p>);
  }

  if (inCode) flushCode();

  return <div className={className}>{elements}</div>;
}

export function SimpleMarkdown({ text, className }: { text: string; className?: string }) {
  return <Markdown className={className}>{text}</Markdown>;
}
