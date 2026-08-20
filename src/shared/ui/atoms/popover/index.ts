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

    private shadowTrigger: HTMLButtonElement | null = null;

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [PopoverElement.styles];
      }

      this.render();
      this.syncTrigger();

      const triggerSlot = this.querySelector('[slot="trigger"]');
      if (triggerSlot) {
        const observer = new MutationObserver(() => this.syncTrigger());
        observer.observe(triggerSlot, { childList: true, subtree: true });
      }
    }

    public open(): void {
      this.panel?.showPopover();
    }

    public hide(): void {
      this.panel?.hidePopover();
    }

    public toggle(): void {
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
    <button id="shadow-trigger" popovertarget="panel">
      <slot name="trigger-content"></slot>
    </button>
    <slot name="trigger" style="display:none"></slot>
    <div class="panel" id="panel" popover role="dialog">
      <slot name="content"></slot>
    </div>
    <div class="arrow"></div>
  `;

      this.panel = shadow.getElementById('panel');
      this.shadowTrigger = shadow.getElementById('shadow-trigger') as HTMLButtonElement | null;
    }

    private syncTrigger(): void {
      const slotted = this.querySelector<HTMLButtonElement>('[slot="trigger"]');
      if (slotted && this.shadowTrigger) {
        let slot = this.shadowTrigger.querySelector<HTMLSlotElement>(
          'slot[name="trigger-content"]',
        );
        if (!slot) {
          slot = document.createElement('slot');
          slot.name = 'trigger-content';
          this.shadowTrigger.append(slot);
        }

        while (slot.firstChild) {
          slot.firstChild.remove();
        }
        [...slotted.childNodes].forEach((child) => {
          slot.append(child.cloneNode(true));
        });
      }
    }
  }

  if (!customElements.get('popover-element')) {
    customElements.define('popover-element', PopoverElement);
  }
}

export {};
