const STEP = 5;

const TRACK_HEIGHT: Record<string, string> = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

const PROGRESS_BAR_STYLES = `
  :host {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .track {
    flex: 1;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  .label {
    flex: none;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    color: var(--text2);
    min-width: 34px;
    text-align: right;
  }

  :host([height="sm"]) .label {
    display: none;
  }
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class ProgressBarElement extends HTMLElement {
    public static observedAttributes = ['value', 'height'];

    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(PROGRESS_BAR_STYLES);

      return sheet;
    })();

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [ProgressBarElement.styles];
        shadow.innerHTML =
          '<div class="track"><div class="fill"></div></div><div class="label"></div>';
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

      const value = Number.parseInt(this.getAttribute('value') ?? '0') || 0;
      const height = this.getAttribute('height') ?? 'sm';
      const pct = Math.min(100, Math.max(0, Math.round(value / STEP) * STEP));

      const track = this.shadowRoot.querySelector<HTMLElement>('.track');
      if (track) {
        track.style.height = TRACK_HEIGHT[height] ?? TRACK_HEIGHT.sm;
      }

      const fill = this.shadowRoot.querySelector<HTMLElement>('.fill');
      if (fill) {
        fill.style.width = `${pct}%`;
      }

      const label = this.shadowRoot.querySelector<HTMLElement>('.label');
      if (label) {
        label.textContent = `${pct}%`;
      }
    }
  }

  if (!customElements.get('progress-bar')) {
    customElements.define('progress-bar', ProgressBarElement);
  }
}

export {};
