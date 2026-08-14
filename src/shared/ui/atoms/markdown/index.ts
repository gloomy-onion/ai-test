import { parseMarkdown } from '@/shared/lib/helpers/markdown-parser';

const STYLES = `
:host {
  display: block;
}

:host(.requirementText) {
  font-size: 14px;
  line-height: 1.6;
}

:host(.previewMarkdown) {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.6;
}

pre {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 16px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 13px;
  font-family: var(--font-mono);
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--surface2);
  padding: 2px 5px;
  border-radius: 4px;
}

pre code {
  background: none;
  padding: 0;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 4px;
}

h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0 4px;
  color: var(--text2);
}

p {
  margin: 4px 0;
  line-height: 1.5;
}

br {
  display: block;
  content: '';
  margin: 4px 0;
}

li {
  margin-left: 16px;
  margin-bottom: 2px;
  line-height: 1.5;
}

strong {
  font-weight: 600;
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class MarkdownRendererElement extends HTMLElement {
    public static observedAttributes = ['text'];

    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [MarkdownRendererElement.styles];
      }
      this.render();
    }

    public attributeChangedCallback(): void {
      this.render();
    }

    private render(): void {
      if (!this.shadowRoot) {
        return;
      }

      const text = this.getAttribute('text') || '';
      this.shadowRoot.innerHTML = parseMarkdown(text);
    }
  }

  if (!customElements.get('markdown-renderer')) {
    customElements.define('markdown-renderer', MarkdownRendererElement);
  }
}

export {};
