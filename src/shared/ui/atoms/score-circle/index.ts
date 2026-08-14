'use client';

const STYLES = `
:host {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-head);
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
  background: var(--bg3);
  border: 2px solid;
}

.high {
  border-color: #4ecd7a;
  color: #4ecd7a;
}

.mid {
  border-color: #f7b32b;
  color: #f7b32b;
}

.low {
  border-color: #ff5c5c;
  color: #ff5c5c;
}
`;

type ScoreVariant = 'high' | 'mid' | 'low';

const scoreVariant = (score: number): ScoreVariant => {
  if (score >= 80) {
    return 'high';
  }

  if (score >= 55) {
    return 'mid';
  }

  return 'low';
};

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class ScoreCircleElement extends HTMLElement {
    public static observedAttributes = ['score'];

    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [ScoreCircleElement.styles];
      }

      this.render();
    }

    public attributeChangedCallback(): void {
      this.render();
    }

    private render(): void {
      const score = Number.parseInt(this.getAttribute('score') ?? '0') || 0;

      const variant = scoreVariant(score);

      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <div class="${variant}">
            ${score}
          </div>
        `;
      }
    }
  }

  if (!customElements.get('score-circle')) {
    customElements.define('score-circle', ScoreCircleElement);
  }
}

export {};
