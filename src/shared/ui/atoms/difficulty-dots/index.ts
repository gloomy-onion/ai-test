'use client';

const STYLES = `
:host {
  display: flex;
  gap: 3px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border2);
}

.dot.filled {
  background: var(--accent3);
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class DifficultyDotsElement extends HTMLElement {
    public static observedAttributes = ['level', 'max'];

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      this.render();
    }

    public attributeChangedCallback(): void {
      this.render();
    }

    private render(): void {
      const level = Number.parseInt(this.getAttribute('level') ?? '0') || 0;
      const max = Number.parseInt(this.getAttribute('max') ?? '3') || 0;

      const dots = Array.from({ length: max }, (_, i) => {
        const filled = i < level ? ' filled' : '';

        return `<span class="dot${filled}"></span>`;
      }).join('');

      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `<style>${STYLES}</style>${dots}`;
      }
    }
  }

  if (!customElements.get('difficulty-dots')) {
    customElements.define('difficulty-dots', DifficultyDotsElement);
  }
}

export {};
