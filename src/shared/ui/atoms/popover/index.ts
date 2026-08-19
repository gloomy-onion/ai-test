const STYLES = `
:host {
  width: 440px;
  height: 440px;
  border-radius: 12px;
}

:host(:has(.panel:popover-open)) ::slotted([slot="trigger"]) {
  pointer-events: none;
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class PopoverElement extends HTMLElement {
    public static observedAttributes = ['position', 'open', 'hide'];

    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    private panel: HTMLElement | null = null;

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [PopoverElement.styles];
      }

      this.render();
    }

    public open(): void {
      this.panel?.showPopover();
    }

    public hide(): void {
      this.panel?.hidePopover();
    }

    public togglePanel(): void {
      console.log('BEFORE:', this.panel?.matches(':popover-open'));

      if (this.panel?.matches(':popover-open')) {
        this.hide();
      } else {
        this.open();
      }
    }

    private render(): void {
      const shadow = this.shadowRoot;
      if (!shadow) {
        return;
      }

      shadow.innerHTML = `
    <slot name="trigger"></slot>
    <div class="panel" id="panel" popover="manual" role="dialog">
      <slot name="content"></slot>
    </div>
    <div class="arrow"></div>
  `;

      this.panel = shadow.getElementById('panel');

      const trigger = this.querySelector<HTMLButtonElement>('[slot="trigger"]');

      if (trigger && this.panel) {
        trigger.popoverTargetElement = this.panel;
      }
    }
  }

  if (!customElements.get('popover-element')) {
    customElements.define('popover-element', PopoverElement);
  }
}

export {};
