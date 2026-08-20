const STYLES = `
:host {
  width: 440px;
  height: 440px;
  border-radius: 12px;
}

:host(:has(.panel:popover-open)) ::slotted([slot="trigger"]) {
  pointer-events: none;
}

.panel {
  position: fixed;
  margin: 0;
  inset: unset;
  top: 0;
  left: 0;
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

    private readonly handleReposition = (): void => {
      this.hide();
    };

    private render(): void {
      const shadow = this.shadowRoot;
      if (!shadow) {
        return;
      }

      this.panel?.removeEventListener('toggle', this.handleToggle);

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

      this.panel?.addEventListener('toggle', this.handleToggle);
    }

    public disconnectedCallback(): void {
      window.removeEventListener('scroll', this.handleReposition, true);
      window.removeEventListener('resize', this.handleReposition);
    }

    private readonly handleToggle = (event: Event): void => {
      const toggleEvent = event as ToggleEvent;
      if (toggleEvent.newState === 'open') {
        this.updatePosition();
        window.addEventListener('scroll', this.handleReposition, true);
        window.addEventListener('resize', this.handleReposition);
      } else {
        window.removeEventListener('scroll', this.handleReposition, true);
        window.removeEventListener('resize', this.handleReposition);
      }
    };

    private updatePosition(): void {
      if (!this.panel || !this.shadowTrigger) {
        return;
      }

      const gap = 8;
      const triggerRect = this.shadowTrigger.getBoundingClientRect();
      const panelRect = this.panel.getBoundingClientRect();
      const position = this.getAttribute('position') ?? 'bottom-start';
      const [vertical, horizontal] = position.split('-') as ['top' | 'bottom', 'start' | 'end'];

      let finalVertical = vertical;
      if (vertical === 'top' && triggerRect.top - panelRect.height - gap < 0) {
        finalVertical = 'bottom';
      } else if (
        vertical === 'bottom' &&
        triggerRect.bottom + gap + panelRect.height > window.innerHeight
      ) {
        finalVertical = 'top';
      }

      const top =
        finalVertical === 'top'
          ? triggerRect.top - panelRect.height - gap
          : triggerRect.bottom + gap;

      const left = horizontal === 'end' ? triggerRect.right - panelRect.width : triggerRect.left;

      this.panel.style.top = `${top}px`;
      this.panel.style.left = `${left}px`;
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
