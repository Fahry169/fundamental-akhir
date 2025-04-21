class NoteCard extends HTMLElement {
  set note(note) {
    this._note = note;
    this.render();
  }

  connectedCallback() {
    if (this._note) {
      this.render();
    }
  }

  render() {
    const isArchived = this._note.archived || false;

    this.innerHTML = `
      <div class="note-card">
        <h3>${this._note.title}</h3>
        <p class="note-date">Created: ${new Date(
          this._note.createdAt
        ).toLocaleString()}</p>
        <div class="note-content">${this._note.body}</div>
        <div class="note-actions">
          <button class="archive-btn btn ${
            isArchived ? "btn-success" : ""
          }" data-id="${this._note.id}">
            <i class="fas fa-${isArchived ? "inbox" : "archive"}"></i> ${
      isArchived ? "Unarchive" : "Archive"
    }
          </button>
          <button class="delete-btn btn btn-danger" data-id="${this._note.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
        <style>
          .note-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .note-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .note-date {
            font-size: 0.8rem;
            color: #777;
            margin-bottom: 0.5rem;
          }
          .note-content {
            margin-bottom: 1rem;
            white-space: pre-wrap;
          }
          .note-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }
        </style>
      </div>
    `;

    const deleteButton = this.querySelector(".delete-btn");
    deleteButton.addEventListener("click", (e) => {
      const event = new CustomEvent("delete-note", {
        detail: {
          id: this._note.id,
        },
        bubbles: true,
      });
      this.dispatchEvent(event);
    });

    const archiveButton = this.querySelector(".archive-btn");
    archiveButton.addEventListener("click", (e) => {
      const eventName = this._note.archived ? "unarchive-note" : "archive-note";
      const event = new CustomEvent(eventName, {
        detail: {
          id: this._note.id,
        },
        bubbles: true,
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define("note-card", NoteCard);
