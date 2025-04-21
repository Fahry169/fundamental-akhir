import "../styles/style.css";

import "./components/app-header.js";
import "./components/app-footer.js";
import "./components/note-card.js";
import "./components/note-form.js";
import "./components/loading-indicator.js";

import NotesAPI from "./data/notes-api.js";

const notesContainer = document.getElementById("notes-container");
const archivedNotesContainer = document.getElementById(
  "archived-notes-container"
);
const notesLoadingIndicator = document.getElementById("notes-loading");
const archivedNotesLoadingIndicator = document.getElementById(
  "archived-notes-loading"
);
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

let activeTab = "active";

const animateNoteCards = (container) => {
  const cards = container.querySelectorAll(".note-card");

  if (cards.length === 0) return;

  anime({
    targets: cards,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: "easeOutExpo",
    duration: 500,
    delay: anime.stagger(100),
  });
};

const showEmptyState = (container, message) => {
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-sticky-note"></i>
      <p>${message}</p>
    </div>
  `;
};

const renderActiveNotes = (notes) => {
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    showEmptyState(
      notesContainer,
      "No active notes found. Add a new note to get started!"
    );
    return;
  }

  notes.forEach((note) => {
    const noteElement = document.createElement("note-card");
    noteElement.note = note;
    notesContainer.appendChild(noteElement);
  });

  animateNoteCards(notesContainer);
};

const renderArchivedNotes = (notes) => {
  archivedNotesContainer.innerHTML = "";

  if (notes.length === 0) {
    showEmptyState(
      archivedNotesContainer,
      "No archived notes found. Archive a note to see it here!"
    );
    return;
  }

  notes.forEach((note) => {
    const noteElement = document.createElement("note-card");
    noteElement.note = note;
    archivedNotesContainer.appendChild(noteElement);
  });

  animateNoteCards(archivedNotesContainer);
};

const loadActiveNotes = async () => {
  notesLoadingIndicator.active = true;

  try {
    const notes = await NotesAPI.getAllNotes();
    renderActiveNotes(notes);
  } catch (error) {
    console.error("Failed to load notes:", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to load active notes. Please try again later.",
    });

    showEmptyState(
      notesContainer,
      "Failed to load notes. Please try again later."
    );
  } finally {
    notesLoadingIndicator.active = false;
  }
};

const loadArchivedNotes = async () => {
  archivedNotesLoadingIndicator.active = true;

  try {
    const notes = await NotesAPI.getArchivedNotes();
    renderArchivedNotes(notes);
  } catch (error) {
    console.error("Failed to load archived notes:", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to load archived notes. Please try again later.",
    });

    showEmptyState(
      archivedNotesContainer,
      "Failed to load archived notes. Please try again later."
    );
  } finally {
    archivedNotesLoadingIndicator.active = false;
  }
};

const refreshNotes = () => {
  if (activeTab === "active") {
    loadActiveNotes();
  } else {
    loadArchivedNotes();
  }
};

const switchTab = (tabName) => {
  activeTab = tabName;

  tabButtons.forEach((button) => {
    if (button.dataset.tab === tabName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  tabContents.forEach((content) => {
    if (content.id === `${tabName}-tab`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  refreshNotes();
};

document.addEventListener("DOMContentLoaded", () => {
  loadActiveNotes();

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  });

  document.addEventListener("add-note", async (event) => {
    const { note } = event.detail;

    try {
      const loadingToast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      loadingToast.fire({
        icon: "info",
        title: "Adding note...",
      });

      await NotesAPI.addNote(note);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Note added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      refreshNotes();
    } catch (error) {
      console.error("Failed to add note:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add note. Please try again.",
      });
    }
  });

  document.addEventListener("delete-note", async (event) => {
    const { id } = event.detail;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3498db",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await NotesAPI.deleteNote(id);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your note has been deleted.",
          showConfirmButton: false,
          timer: 1500,
        });

        refreshNotes();
      } catch (error) {
        console.error("Failed to delete note:", error);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete note. Please try again.",
        });
      }
    }
  });

  document.addEventListener("archive-note", async (event) => {
    const { id } = event.detail;

    try {
      await NotesAPI.archiveNote(id);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Note archived successfully",
      });

      refreshNotes();
    } catch (error) {
      console.error("Failed to archive note:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to archive note. Please try again.",
      });
    }
  });

  document.addEventListener("unarchive-note", async (event) => {
    const { id } = event.detail;

    try {
      await NotesAPI.unarchiveNote(id);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Note unarchived successfully",
      });

      refreshNotes();
    } catch (error) {
      console.error("Failed to unarchive note:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to unarchive note. Please try again.",
      });
    }
  });
});
