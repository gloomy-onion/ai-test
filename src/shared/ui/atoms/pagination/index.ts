'use client';

const STYLES = `
:host {
  display: inline-block;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}
`;

const isBrowser = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

if (isBrowser) {
  class PaginationElement extends HTMLElement {
    public static observedAttributes = ['page', 'total-pages'];

    private static readonly styles = (() => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLES);

      return sheet;
    })();

    private isInitialized = false;

    public connectedCallback(): void {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [PaginationElement.styles];
      }

      if (!this.isInitialized) {
        this.addEventListener('click', this.handleClick);
        this.isInitialized = true;
      }

      this.render();
    }

    public disconnectedCallback(): void {
      this.removeEventListener('click', this.handleClick);
    }

    public prev(): void {
      const page = this.currentPage;

      if (page > 1) {
        this.setPage(page - 1);
      }
    }

    public next(): void {
      const page = this.currentPage;

      if (page < this.totalPages) {
        this.setPage(page + 1);
      }
    }

    public first(): void {
      if (this.currentPage > 1) {
        this.setPage(1);
      }
    }

    public last(): void {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.totalPages);
      }
    }

    private get currentPage(): number {
      const page = Number(this.getAttribute('page')) || 1;

      return Math.min(Math.max(page, 1), this.totalPages);
    }

    public get totalPages(): number {
      return Math.max(Number(this.getAttribute('total-pages')) || 1, 1);
    }

    public set totalPages(value: number) {
      this.setAttribute('total-pages', String(value));
    }

    private readonly handleClick = (event: Event): void => {
      const target = event
        .composedPath()
        .find(
          (node): node is HTMLElement =>
            node instanceof HTMLElement && node.tagName === 'BUTTON-ELEMENT',
        );

      if (!target || target.hasAttribute('disabled')) {
        return;
      }

      const el = target as HTMLElement;
      const { action } = el.dataset;
      const page = el.dataset.page ? Number(el.dataset.page) : undefined;

      if (action === 'first') {
        this.first();

        return;
      }
      if (action === 'prev') {
        this.prev();

        return;
      }
      if (action === 'next') {
        this.next();

        return;
      }
      if (action === 'last') {
        this.last();

        return;
      }
      if (page) {
        this.setPage(page);
      }
    };

    private setPage(page: number): void {
      const nextPage = Math.min(Math.max(page, 1), this.totalPages);

      if (nextPage === this.currentPage) {
        return;
      }

      this.setAttribute('page', String(nextPage));

      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            page: nextPage,
            totalPages: this.totalPages,
          },
          bubbles: true,
        }),
      );
    }

    private getVisiblePages(): number[] {
      const { totalPages } = this;
      const { currentPage } = this;
      const sectionSize = 5;

      if (totalPages <= sectionSize) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
      }

      let start = currentPage - 2;

      if (start < 1) {
        start = 1;
      }

      if (start + sectionSize - 1 > totalPages) {
        start = totalPages - sectionSize + 1;
      }

      return Array.from({ length: sectionSize }, (_, index) => start + index);
    }

    private render(): void {
      const shadow = this.shadowRoot;

      if (!shadow) {
        return;
      }

      const { currentPage } = this;
      const { totalPages } = this;
      const pages = this.getVisiblePages();

      const activeStyle = `
      background:var(--accent) !important;border-color:var(--accent) !important;color:white !important;`;

      shadow.innerHTML = `
        <nav class="pagination" aria-label="Pagination">
          <button-element
            data-action="first"
            aria-label="First page"
            ${currentPage === 1 ? 'disabled' : ''}
          >&lt;&lt;</button-element>
          <button-element
            data-action="prev"
            aria-label="Previous page"
            ${currentPage === 1 ? 'disabled' : ''}
          >←</button-element>
          ${pages
            .map(
              (page) => `
              <button-element
                style="${page === currentPage ? activeStyle : ''}"
                data-page="${page}"
              >${page}</button-element>
            `,
            )
            .join('')}
          <button-element
            data-action="next"
            aria-label="Next page"
            ${currentPage === totalPages ? 'disabled' : ''}
          >→</button-element>
          <button-element
            data-action="last"
            aria-label="Last page"
            ${currentPage === totalPages ? 'disabled' : ''}
          >&gt;&gt;</button-element>
        </nav>
      `;
    }

    public attributeChangedCallback(): void {
      if (this.isInitialized) {
        this.render();
      }
    }
  }

  if (!customElements.get('pagination-element')) {
    customElements.define('pagination-element', PaginationElement);
  }
}

export {};
