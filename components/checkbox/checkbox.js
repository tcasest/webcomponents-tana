/**
 * Autor: Tanausú Castrillo Estévez
 * Componente de checkbox mínimo usando Web Components + lit-html.
 */
import {
  html,
  render,
} from "https://cdn.jsdelivr.net/npm/lit-html@3.1.2/lit-html.js";
import { repeat } from "https://cdn.jsdelivr.net/npm/lit-html@3.1.2/directives/repeat.js";
import styles from "./checkbox.css" with { type: "css" };
import { events } from "../../utils/events.js";

export class MiCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ["item-id", "label", "checked", "disabled"];
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
    this.#disposables.push(
      events(this, "keydown", this.#handleKeyDown.bind(this)),
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

  get itemId() {
    return this.getAttribute("item-id") ?? "";
  }

  set itemId(value) {
    this.setAttribute("item-id", value);
  }

  get label() {
    return this.getAttribute("label") ?? "Opción";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value) {
    if (value) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
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
      .find((n) => n?.dataset && "role" in n.dataset);
    if (!node || this.disabled) return;
    ev.stopPropagation();
    this.checked = !this.checked;
    node.dispatchEvent(this.#createEvent());
  }

  #handleKeyDown(ev) {
    if (this.disabled) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this.checked = !this.checked;
      this.dispatchEvent(this.#createEvent());
    }
  }

  #createEvent() {
    return new CustomEvent("checkbox-change", {
      bubbles: true,
      composed: true,
      detail: {
        id: this.itemId,
        label: this.label,
        checked: this.checked,
      },
    });
  }

  render() {
    const items = [this.label];
    const template = html`
      <div class="wrapper">
        ${repeat(
          items,
          (item) => item,
          () => html`
            <div
              class="checkbox ${this.disabled ? "disabled" : ""}"
              data-role="checkbox"
              tabindex=${this.disabled ? -1 : 0}
              role="checkbox"
              .title=${this.label}
              ?aria-checked=${this.checked}
              ?aria-disabled=${this.disabled}
            >
              <span class="control ${this.checked ? "checked" : ""}">
                <span class="tick">${this.checked ? "✓" : ""}</span>
              </span>
              <span class="text">${this.label}</span>
            </div>
          `,
        )}
      </div>
    `;
    render(template, this.#shadow);
  }
}

customElements.define("mi-checkbox", MiCheckbox);
export default MiCheckbox;
