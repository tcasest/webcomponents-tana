/**
 * Autor: Tanausú Castrillo Estévez
 * Spinner mínimo para subir o bajar una cantidad.
 */
import {
  html,
  render,
} from "https://cdn.jsdelivr.net/npm/lit-html@3.1.2/lit-html.js";
import { repeat } from "https://cdn.jsdelivr.net/npm/lit-html@3.1.2/directives/repeat.js";
import styles from "./spinner.css" with { type: "css" };
import { events } from "../../utils/events.js";

export class MiSpinner extends HTMLElement {
  static get observedAttributes() {
    return ["label", "value", "min", "max", "disabled"];
  }

  #shadow;
  #disposables = [];

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.#disposables.push(
      events(this.#shadow, "click", this.#handleClick.bind(this)),
    );
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
    return this.getAttribute("label") ?? "Cantidad";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get value() {
    return Number(this.getAttribute("value") ?? 0);
  }

  set value(value) {
    this.setAttribute("value", String(value));
  }

  get min() {
    return Number(this.getAttribute("min") ?? 0);
  }

  set min(value) {
    this.setAttribute("min", String(value));
  }

  get max() {
    const value = this.getAttribute("max");
    return value === null ? Infinity : Number(value);
  }

  set max(value) {
    this.setAttribute("max", String(value));
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  #handleClick(ev) {
    const node = ev
      .composedPath()
      .find((n) => n?.dataset && "action" in n.dataset);
    if (!node || this.disabled) return;
    ev.stopPropagation();

    if (node.dataset.action === "decrease" && this.value > this.min) {
      this.value = this.value - 1;
      this.dispatchEvent(this.#createEvent());
    }

    if (node.dataset.action === "increase" && this.value < this.max) {
      this.value = this.value + 1;
      this.dispatchEvent(this.#createEvent());
    }
  }

  #createEvent() {
    return new CustomEvent("spinner-change", {
      bubbles: true,
      composed: true,
      detail: {
        label: this.label,
        value: this.value,
      },
    });
  }

  render() {
    const items = [this.value];
    const template = html`
      <div class="wrapper">
        <span class="label">${this.label}</span>
        <div class="box">
          <button
            class="button"
            data-action="decrease"
            type="button"
            .disabled=${this.disabled || this.value <= this.min}
            ?aria-disabled=${this.disabled || this.value <= this.min}
          >
            −
          </button>

          ${repeat(
            items,
            (item) => item,
            (item) => html`<span class="value">${item}</span>`,
          )}

          <button
            class="button"
            data-action="increase"
            type="button"
            .disabled=${this.disabled || this.value >= this.max}
            ?aria-disabled=${this.disabled || this.value >= this.max}
          >
            +
          </button>
        </div>
      </div>
    `;
    render(template, this.#shadow);
  }
}

customElements.define("mi-spinner", MiSpinner);
export default MiSpinner;
