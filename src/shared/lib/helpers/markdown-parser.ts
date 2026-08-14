const BOLD_RE = /\*\*(.+?)\*\*/g;
const CODE_RE = /`(.+?)`/g;

export const escapeHtml = (text: string): string => {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
};

export const renderInline = (text: string): string => {
  let result = escapeHtml(text);
  // Bold: **text**
  result = result.replaceAll(BOLD_RE, '<strong>$1</strong>');
  // Inline code: `text`
  result = result.replaceAll(CODE_RE, '<code>$1</code>');

  return result;
};

export const parseMarkdown = (markdown: string): string => {
  const lines = markdown.split('\n');
  let html = '';
  let inCode = false;
  let buf: string[] = [];

  const flushCode = () => {
    if (buf.length) {
      html += `<pre><code>${buf.join('\n')}</code></pre>`;
      buf = [];
    }
  };

  for (const raw of lines) {
    const s = raw.trimEnd();

    if (s.startsWith('```')) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      buf.push(escapeHtml(raw));
      continue;
    }

    if (s === '') {
      html += '<br>';
      continue;
    }

    if (s.startsWith('## ')) {
      html += `<h3>${renderInline(s.slice(3))}</h3>`;
      continue;
    }

    if (s.startsWith('**') && s.endsWith('**') && s.length > 4) {
      html += `<h4>${renderInline(s.slice(2, -2))}</h4>`;
      continue;
    }

    if (s.startsWith('- ')) {
      html += `<li>${renderInline(s.slice(2))}</li>`;
      continue;
    }

    html += `<p>${renderInline(s)}</p>`;
  }

  if (inCode) {
    flushCode();
  }

  return html;
};
