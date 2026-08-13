'use client';

const STYLES = `
:host {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px !important;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  box-sizing: border-box;
}

:host([earned]) {
  border-color: var(--accent3);
  color: var(--accent3);
  background: rgba(247, 179, 43, 0.08);
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class BadgePillElement extends HTMLElement {
    public connectedCallback(): void {
      if (this.shadowRoot) {
        return;
      }

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `<style>${STYLES}</style><slot></slot>`;
    }
  }

  if (!customElements.get('badge-pill')) {
    customElements.define('badge-pill', BadgePillElement);
  }
}

export {};
