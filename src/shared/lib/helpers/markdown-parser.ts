const BOLD_RE = /\*\*(.+?)\*\*/g;
const CODE_RE = /`(.+?)`/g;
const TABLE_SEP_RE = /^\|?(\s*:?-+:?\s*\|\s*)*:?-+:?\s*\|?$/;

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

const splitCells = (line: string): string[] => {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .replace(/\\\|/g, '\u0000')
    .split('|')
    .map((cell) => cell.replaceAll('\u0000', '|').trim());
};

const parseTable = (lines: string[], headerIdx: number): { html: string; nextIdx: number } => {
  const header = splitCells(lines[headerIdx]);
  const rows: string[][] = [];
  let i = headerIdx + 2;

  while (i < lines.length) {
    const row = lines[i].trim();
    if (row === '' || !row.startsWith('|')) break;
    rows.push(splitCells(row));
    i++;
  }

  const html =
    `<table><thead><tr>${header.map((h) => `<th>${renderInline(h)}</th>`).join('')}</tr></thead>` +
    (rows.length
      ? `<tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody>`
      : '') +
    '</table>';

  return { html, nextIdx: i - 1 };
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

  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trimEnd();

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
      buf.push(escapeHtml(lines[i]));
      continue;
    }

    if (s === '') {
      html += '<br>';
      continue;
    }

    if (s.startsWith('|')) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;

      if (j < lines.length && TABLE_SEP_RE.test(lines[j].trim())) {
        const { html: tableHtml, nextIdx } = parseTable(lines, i);
        html += tableHtml;
        i = nextIdx;
        continue;
      }
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
