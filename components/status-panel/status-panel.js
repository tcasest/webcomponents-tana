/**
 * Autor: Tanausú Castrillo Estévez
 * Este componente hace de receptor de eventos, parecido a la idea
 * del carrito de Pedro. No conoce directamente a button, checkbox ni spinner.
 * El componente status-panel actúa como coordinador. Escucha eventos globales y modifica otros
 * componentes sin acoplarse directamente a ellos.
 */
import { html, render } from "https://unpkg.com/lit-html?module";
import styles from "./status-panel.css" with { type: "css" };
import { events } from "../../utils/events.js";

export class MiStatusPanel extends HTMLElement {
  #shadow;
  #disposables = [];
  #selected = new Map();
  #message = "Todavía no se ha producido ninguna interacción.";
  #quantity = 1;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.adoptedStyleSheets = [styles];
    this.render();
  }

  connectedCallback() {
    this.#disposables.push(
      events(
        document,
        "checkbox-change",
        this.#handleCheckboxChange.bind(this),
      ),
    );
    this.#disposables.push(
      events(document, "button-click", this.#handleButtonClick.bind(this)),
    );
    this.#disposables.push(
      events(document, "spinner-change", this.#handleSpinnerChange.bind(this)),
    );
  }

  disconnectedCallback() {
    this.#disposables.forEach((dispose) => dispose());
    this.#disposables = [];
  }

  #handleCheckboxChange(ev) {
    const { id, label, checked } = ev.detail;
    if (checked) {
      this.#selected.set(id, label);
    } else {
      this.#selected.delete(id);
    }

    ev.stopPropagation();
    const count = this.#selected.size;
    const state = checked ? "marcada" : "desmarcada";
    this.#message = `La casilla "${label}" se ha ${state}. Seleccionadas: ${count}.`;
    this.render();
  }

  #handleButtonClick(ev) {
    const { label, variant } = ev.detail;
    ev.stopPropagation();
    const count = this.#selected.size;
    this.#message = `Se ha pulsado el botón "${label}" (${variant}). Casillas seleccionadas: ${count}.`;
    this.render();
  }

  #handleSpinnerChange(ev) {
    const { label, value } = ev.detail;
    this.#quantity = value;
    ev.stopPropagation();
    this.#message = `${label}: ${value}.`;
    this.render();
  }

  render() {
    const template = html`
      <section class="panel">
        <h2 class="title">Estado de la aplicación</h2>
        <p class="row">
          <span class="strong">Log:</span>
          ${this.#message}
        </p>
        <p class="row">
          <span class="strong">Total de casillas marcadas:</span>
          ${this.#selected.size}
        </p>
        <p class="row">
          <span class="strong">Cantidad actual:</span>
          ${this.#quantity}
        </p>
      </section>
    `;
    render(template, this.#shadow);
  }
}

customElements.define("mi-status-panel", MiStatusPanel);
export default MiStatusPanel;
