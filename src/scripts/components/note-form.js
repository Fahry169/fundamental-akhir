class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEventListeners();
  }

  render() {
    this.innerHTML = `
        <div class="note-form-container">
          <h2>Add New Note</h2>
          <form id="add-note-form">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" class="form-control" required placeholder="Note Title">
            </div>
            <div class="form-group">
              <label for="body">Content</label>
              <textarea id="body" class="form-control" required placeholder="Write your note here..."></textarea>
            </div>
            <button type="submit" class="btn">
              <i class="fas fa-plus"></i> Add Note
            </button>
          </form>
          <style>
            .note-form-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 1.5rem;
              margin-bottom: 1rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: bold;
            }
          </style>
        </div>
      `;
  }

  initEventListeners() {
    const form = this.querySelector("#add-note-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = this.querySelector("#title").value;
      const body = this.querySelector("#body").value;

      const noteData = {
        title,
        body,
      };

      const event = new CustomEvent("add-note", {
        detail: {
          note: noteData,
        },
        bubbles: true,
      });

      this.dispatchEvent(event);
      form.reset();
    });
  }
}

customElements.define("note-form", NoteForm);
