/**
 * Autor: Tanausú Castrillo Estévez
 * Componente de botón mínimo usando Web Components + lit-html.
 */
import { html, render } from 'https://unpkg.com/lit-html?module';
import { repeat } from 'https://unpkg.com/lit-html/directives/repeat.js?module';
import styles from './button.css' with { type: 'css' };
import { events } from '../../utils/events.js';

export class MiButton extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'variant', 'disabled'];
  }

  #shadow;
  #disposables = [];

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.#disposables.push(events(this.#shadow, 'click', this.#handleClick.bind(this)));
    this.#disposables.push(events(this, 'keydown', this.#handleKeyDown.bind(this)));
    this.render();
  }

  disconnectedCallback() {
    this.#disposables.forEach((dispose) => dispose());
    this.#disposables = [];
  }

  attributeChangedCallback() {
    this.render();
  }

  get label() {
    return this.getAttribute('label') ?? 'Botón';
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get variant() {
    return this.getAttribute('variant') ?? 'primary';
  }

  set variant(value) {
    this.setAttribute('variant', value);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  #handleClick(ev) {
    const node = ev.composedPath().find((n) => n?.dataset && 'role' in n.dataset);
    if (!node || this.disabled) return;
    ev.stopPropagation();
    node.dispatchEvent(this.#createEvent());
  }

  #handleKeyDown(ev) {
    if (this.disabled) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.dispatchEvent(this.#createEvent());
    }
  }

  #createEvent() {
    return new CustomEvent('button-click', {
      bubbles: true,
      composed: true,
      detail: {
        label: this.label,
        variant: this.variant
      }
    });
  }

  render() {
    const items = [this.variant];
    const template = html`
      <div class="wrapper">
        ${repeat(
          items,
          (item) => item,
          (item) => html`
            <button
              class="button ${item}"
              data-role="button"
              type="button"
              .disabled=${this.disabled}
              ?aria-disabled=${this.disabled}>
              ${this.label}
            </button>
          `
        )}
      </div>
    `;
    render(template, this.#shadow);
  }
}

customElements.define('mi-button', MiButton);
export default MiButton;
