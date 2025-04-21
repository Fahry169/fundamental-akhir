class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <footer>
          <div class="container">
            <p>&copy; Fahry Firdaus || 2025</p>
          </div>
          <style>
            footer {
              background-color: #333;
              color: white;
              text-align: center;
              padding: 0.5rem;
              margin-top: 2rem;
            }
            footer p {
              margin: 0;
            }
          </style>
        </footer>
      `;
  }
}

customElements.define("app-footer", AppFooter);
