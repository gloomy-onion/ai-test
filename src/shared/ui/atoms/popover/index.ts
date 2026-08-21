'use client';

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
  border: none;
  padding: 0;
  background: none;
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

    private isPopoverOpen = false;

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [PopoverElement.styles];
      }

      this.addEventListener('click', this.handleClick);

      this.render();
    }

    public disconnectedCallback(): void {
      this.removeEventListener('click', this.handleClick);

      document.removeEventListener('pointerdown', this.handleOutsideClick, true);
      document.removeEventListener('keydown', this.handleEscape);
      window.removeEventListener('scroll', this.handleReposition, true);
      window.removeEventListener('resize', this.handleReposition);
    }

    public open(): void {
      if (this.isPopoverOpen) {
        return;
      }
      this.panel?.showPopover();
      this.isPopoverOpen = true;
      this.updatePosition();
      this.attachLifecycleListeners();
    }

    public hide(): void {
      if (!this.isPopoverOpen) {
        return;
      }
      this.panel?.hidePopover();
      this.isPopoverOpen = false;
      this.detachLifecycleListeners();
    }

    public toggle(): void {
      if (this.isPopoverOpen) {
        this.hide();
      } else {
        this.open();
      }
    }

    private readonly handleReposition = (): void => {
      this.hide();
    };

    private readonly handleClick = (event: Event): void => {
      const path = event.composedPath();
      for (const node of path) {
        if (node instanceof HTMLElement && node.getAttribute('slot') === 'trigger') {
          this.toggle();

          return;
        }
      }
    };

    private readonly handleOutsideClick = (event: Event): void => {
      if (!this.isPopoverOpen) {
        return;
      }
      const path = event.composedPath();
      for (const node of path) {
        if (node === this) {
          return;
        }
      }
      this.hide();
    };

    private readonly handleEscape = (event: KeyboardEvent): void => {
      if (!this.isPopoverOpen) {
        return;
      }
      if (event.key === 'Escape') {
        this.hide();
      }
    };

    private attachLifecycleListeners(): void {
      document.addEventListener('pointerdown', this.handleOutsideClick, true);
      document.addEventListener('keydown', this.handleEscape);
      window.addEventListener('scroll', this.handleReposition, true);
      window.addEventListener('resize', this.handleReposition);
    }

    private detachLifecycleListeners(): void {
      document.removeEventListener('pointerdown', this.handleOutsideClick, true);
      document.removeEventListener('keydown', this.handleEscape);
      window.removeEventListener('scroll', this.handleReposition, true);
      window.removeEventListener('resize', this.handleReposition);
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
    }

    private updatePosition(): void {
      const trigger = this.querySelector<HTMLElement>('[slot="trigger"]');
      if (!this.panel || !trigger) {
        return;
      }

      const gap = 8;
      const triggerRect = trigger.getBoundingClientRect();
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
  }

  if (!customElements.get('popover-element')) {
    customElements.define('popover-element', PopoverElement);
  }
}

export {};
