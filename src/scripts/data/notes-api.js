const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesAPI {
  static async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to get notes");
      }

      return responseJson.data;
    } catch (error) {
      console.error("Error getting notes:", error);
      throw error;
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to get archived notes");
      }

      return responseJson.data;
    } catch (error) {
      console.error("Error getting archived notes:", error);
      throw error;
    }
  }

  static async addNote(note) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to add note");
      }

      return responseJson.data;
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  }

  static async archiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: "POST",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to archive note");
      }

      return responseJson.message;
    } catch (error) {
      console.error("Error archiving note:", error);
      throw error;
    }
  }

  static async unarchiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: "POST",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to unarchive note");
      }

      return responseJson.message;
    } catch (error) {
      console.error("Error unarchiving note:", error);
      throw error;
    }
  }

  static async deleteNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Failed to delete note");
      }

      return responseJson.message;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  }
}

export default NotesAPI;
