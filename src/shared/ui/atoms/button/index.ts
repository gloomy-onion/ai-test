'use client';

const STYLES = `
:host {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px !important;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border2);
  background: transparent;
  color: var(--text);
  transition: all 0.15s;
  font-family: var(--font-body);
  -webkit-user-select: none;
  user-select: none;
}

:host(:hover) {
  background: var(--surface2);
}

:host([variant="primary"]) {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

:host([variant="primary"]:hover) {
  background: #7d76ff;
  border-color: #7d76ff;
}

:host([size="sm"]) {
  padding: 6px 12px;
  font-size: 13px;
}

:host([disabled]) {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

:host([variant="danger"]) {
  color: var(--danger);
  border-color: rgba(255, 92, 92, 0.4);
}

:host([full-width]) {
  width: 100%;
  justify-content: center;
}

button {
  all: unset;
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class ButtonElement extends HTMLElement {
    static readonly #sheet = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    public static get observedAttributes() {
      return ['disabled'];
    }

    #button: Element | null = null;

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [ButtonElement.#sheet];
        shadow.innerHTML = '<button part="button"><slot></slot></button>';
        this.#button = shadow.querySelector('button');
      }
      this.#syncDisabled();

      if (this.#button) {
        this.#button.addEventListener('click', () => {
          const handler = (this as any).onclick;
          if (typeof handler === 'function') {
            handler.call(this);
          }
        });
      }
    }

    public attributeChangedCallback(): void {
      this.#syncDisabled();
    }

    #syncDisabled(): void {
      if (this.#button) {
        (this.#button as any).disabled = this.hasAttribute('disabled');
      }
    }
  }

  if (!customElements.get('button-element')) {
    customElements.define('button-element', ButtonElement);
  }
}

export {};
