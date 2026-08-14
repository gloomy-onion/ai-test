'use client';

const STYLES = `
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class SpinnerElement extends HTMLElement {
    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    public connectedCallback(): void {
      if (this.shadowRoot) {
        return;
      }

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = [SpinnerElement.styles];

      const size = this.getAttribute('size');
      const className = size === 'sm' ? 'sm' : '';

      shadow.innerHTML = `
        <div class="${className}"></div>
      `;
    }
  }

  if (!customElements.get('spinner-element')) {
    customElements.define('spinner-element', SpinnerElement);
  }
}

export {};
