class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <header>
          <div class="container">
            <h1><i class="fas fa-sticky-note"></i> Notes App</h1>
          </div>
          <style>
            header {
              background-color: #3498db;
              color: white;
              padding: 1rem;
              text-align: center;
            }
            header h1 {
              margin: 0;
              font-size: 2rem;
              color: white;
            }
          </style>
        </header>
      `;
  }
}

customElements.define("app-header", AppHeader);
