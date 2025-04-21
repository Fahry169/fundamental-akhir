class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this._active = false;
  }

  static get observedAttributes() {
    return ["active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active") {
      this._active = newValue !== null;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  set active(value) {
    if (value) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  get active() {
    return this.hasAttribute("active");
  }

  render() {
    this.innerHTML = `
        <div class="loading-container ${this._active ? "active" : ""}">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
