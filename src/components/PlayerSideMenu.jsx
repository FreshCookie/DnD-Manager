import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Edit,
  BookOpen,
  Package,
  Save,
  Plus,
  Trash2,
  Calendar,
  Coins,
} from "lucide-react";

const PlayerSideMenu = ({ isOpen, onClose, character, characterData }) => {
  const [activeTab, setActiveTab] = useState("character");
  const [editForm, setEditForm] = useState({
    name: "",
    class: "",
    race: "",
    background: "",
    level: "",
    hp: "",
    maxHp: "",
    alignment: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "Allgemein",
  });
  const [inventory, setInventory] = useState({
    items: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
  });
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Initialize form when characterData changes
  useEffect(() => {
    if (characterData) {
      setEditForm({
        name: characterData.name || "",
        class: characterData.class || "",
        race: characterData.race || "",
        background: characterData.background || characterData.description || "",
        level: characterData.level || "",
        hp: characterData.hp || "",
        maxHp: characterData.maxHp || "",
        alignment: characterData.alignment || "",
      });
    }
  }, [characterData]);

  // Load notes when tab changes to notes
  useEffect(() => {
    if (activeTab === "notes" && character) {
      fetchNotes();
    }
  }, [activeTab, character]);

  const fetchNotes = async () => {
    if (!character) return;

    setIsLoadingNotes(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/notes`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Notizen");
      }

      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Fehler beim Laden der Notizen:", error);
      alert("Fehler beim Laden der Notizen");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Load inventory when tab changes to inventory
  useEffect(() => {
    if (activeTab === "inventory" && character) {
      fetchInventory();
    }
  }, [activeTab, character]);

  const fetchInventory = async () => {
    if (!character) return;

    setIsLoadingInventory(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/inventory`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden des Inventars");
      }

      const data = await response.json();
      setInventory(
        data.inventory || {
          items: [],
          currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        },
      );
    } catch (error) {
      console.error("Fehler beim Laden des Inventars:", error);
      alert("Fehler beim Laden des Inventars");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteForm.title.trim()) {
      alert("Titel ist erforderlich!");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const url = editingNote
        ? `${API_BASE_URL}/api/characters/${character}/notes/${editingNote.id}`
        : `${API_BASE_URL}/api/characters/${character}/notes`;

      const method = editingNote ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(noteForm),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Notiz");
      }

      alert(editingNote ? "Notiz aktualisiert!" : "Notiz erstellt!");
      setNoteForm({ title: "", content: "", category: "Allgemein" });
      setIsAddingNote(false);
      setEditingNote(null);
      fetchNotes(); // Reload notes
    } catch (error) {
      console.error("Fehler beim Speichern der Notiz:", error);
      alert("Fehler beim Speichern der Notiz. Bitte versuche es erneut.");
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category || "Allgemein",
    });
    setIsAddingNote(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Möchtest du diese Notiz wirklich löschen?")) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/notes/${noteId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Notiz");
      }

      alert("Notiz gelöscht!");
      fetchNotes(); // Reload notes
    } catch (error) {
      console.error("Fehler beim Löschen der Notiz:", error);
      alert("Fehler beim Löschen der Notiz. Bitte versuche es erneut.");
    }
  };

  const handleCancelNote = () => {
    setNoteForm({ title: "", content: "", category: "Allgemein" });
    setIsAddingNote(false);
    setEditingNote(null);
  };

  const handleSaveChanges = async () => {
    if (!editForm.name.trim()) {
      alert("Charaktername ist erforderlich!");
      return;
    }

    setIsSaving(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editForm),
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Änderungen");
      }

      alert("Änderungen erfolgreich gespeichert!");
      setActiveTab("character");
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern der Änderungen. Bitte versuche es erneut.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to current characterData
    if (characterData) {
      setEditForm({
        name: characterData.name || "",
        class: characterData.class || "",
        race: characterData.race || "",
        background: characterData.background || characterData.description || "",
        level: characterData.level || "",
        hp: characterData.hp || "",
        maxHp: characterData.maxHp || "",
        alignment: characterData.alignment || "",
      });
    }
    setActiveTab("character");
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "character", label: "Mein Charakter", icon: User },
    { id: "edit", label: "Bearbeiten", icon: Edit },
    { id: "notes", label: "Notizen", icon: BookOpen },
    { id: "inventory", label: "Inventar", icon: Package },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/30 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Spieler Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Schließen"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-500/30 bg-gray-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-600/30 text-purple-300 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-6">
          {/* Mein Charakter Tab */}
          {activeTab === "character" && (
            <div className="space-y-6">
              {characterData ? (
                <>
                  {/* Character Image */}
                  {characterData.image && (
                    <div className="flex justify-center">
                      <img
                        src={characterData.image}
                        alt={characterData.name}
                        className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Character Name */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {characterData.name}
                    </h3>
                    {characterData.class && (
                      <p className="text-xl text-purple-300">
                        {characterData.class}
                        {characterData.race && ` • ${characterData.race}`}
                      </p>
                    )}
                  </div>

                  {/* Character Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {characterData.level && (
                      <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Level</div>
                        <div className="text-2xl font-bold text-white">
                          {characterData.level}
                        </div>
                      </div>
                    )}
                    {characterData.hp !== undefined && (
                      <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">HP</div>
                        <div className="text-2xl font-bold text-red-400">
                          {characterData.hp}
                          {characterData.maxHp && `/${characterData.maxHp}`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Story */}
                  {characterData.background && (
                    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-purple-300 mb-3">
                        Background Story
                      </h4>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {characterData.background}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  {characterData.alignment && (
                    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
                        Alignment
                      </div>
                      <div className="text-lg text-white">
                        {characterData.alignment}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Kein Charakter ausgewählt</p>
                </div>
              )}
            </div>
          )}

          {/* Bearbeiten Tab */}
          {activeTab === "edit" && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Charaktername *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Riku Hoshido"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Klasse
                  </label>
                  <input
                    type="text"
                    value={editForm.class}
                    onChange={(e) =>
                      setEditForm({ ...editForm, class: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Dieb"
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rasse
                  </label>
                  <input
                    type="text"
                    value={editForm.race}
                    onChange={(e) =>
                      setEditForm({ ...editForm, race: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Mensch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level
                  </label>
                  <input
                    type="number"
                    value={editForm.level}
                    onChange={(e) =>
                      setEditForm({ ...editForm, level: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                    min="1"
                    max="20"
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    HP
                  </label>
                  <input
                    type="number"
                    value={editForm.hp}
                    onChange={(e) =>
                      setEditForm({ ...editForm, hp: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                    min="0"
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max HP
                  </label>
                  <input
                    type="number"
                    value={editForm.maxHp}
                    onChange={(e) =>
                      setEditForm({ ...editForm, maxHp: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                    min="1"
                  />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alignment
                </label>
                <select
                  value={editForm.alignment}
                  onChange={(e) =>
                    setEditForm({ ...editForm, alignment: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wähle ein Alignment...</option>
                  <option value="Lawful Good">Lawful Good</option>
                  <option value="Neutral Good">Neutral Good</option>
                  <option value="Chaotic Good">Chaotic Good</option>
                  <option value="Lawful Neutral">Lawful Neutral</option>
                  <option value="True Neutral">True Neutral</option>
                  <option value="Chaotic Neutral">Chaotic Neutral</option>
                  <option value="Lawful Evil">Lawful Evil</option>
                  <option value="Neutral Evil">Neutral Evil</option>
                  <option value="Chaotic Evil">Chaotic Evil</option>
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hintergrundgeschichte
                </label>
                <textarea
                  value={editForm.background}
                  onChange={(e) =>
                    setEditForm({ ...editForm, background: e.target.value })
                  }
                  rows="8"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Erzähle die Geschichte deines Charakters..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={!editForm.name.trim() || isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Speichere..." : "Speichern"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Notizen Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Add Note Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Meine Notizen</h3>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Neue Notiz
                </button>
              </div>

              {/* Add/Edit Note Form */}
              {isAddingNote && (
                <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-lg font-bold text-white mb-4">
                    {editingNote ? "Notiz bearbeiten" : "Neue Notiz"}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Titel *
                      </label>
                      <input
                        type="text"
                        value={noteForm.title}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="z.B. Wichtiger Quest-Hinweis"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kategorie
                      </label>
                      <select
                        value={noteForm.category}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Allgemein">Allgemein</option>
                        <option value="Quest">Quest</option>
                        <option value="NPC">NPC</option>
                        <option value="Story">Story</option>
                        <option value="Kampf">Kampf</option>
                        <option value="Items">Items</option>
                        <option value="Sonstiges">Sonstiges</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Inhalt
                      </label>
                      <textarea
                        value={noteForm.content}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, content: e.target.value })
                        }
                        rows="6"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Schreibe deine Notiz hier..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveNote}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        Speichern
                      </button>
                      <button
                        onClick={handleCancelNote}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes List */}
              {isLoadingNotes ? (
                <div className="text-center py-12 text-gray-400">
                  Lade Notizen...
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <p className="text-gray-400 text-lg mb-2">
                    Noch keine Notizen
                  </p>
                  <p className="text-gray-500 text-sm">
                    Erstelle deine erste Notiz!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">
                            {note.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded">
                              {note.category || "Allgemein"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(note.createdAt).toLocaleDateString(
                                "de-DE",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mt-2">
                          {note.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inventar Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Mein Inventar</h3>
                <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                  Nur vom GM bearbeitbar
                </div>
              </div>

              {isLoadingInventory ? (
                <div className="text-center py-12 text-gray-400">
                  Lade Inventar...
                </div>
              ) : (
                <>
                  {/* Currency Section */}
                  <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-700/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <h4 className="text-lg font-bold text-white">Währung</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Platin</div>
                        <div className="text-2xl font-bold text-purple-300">
                          {inventory.currency.platinum || 0}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Gold</div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {inventory.currency.gold || 0}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Silber</div>
                        <div className="text-2xl font-bold text-gray-300">
                          {inventory.currency.silver || 0}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Kupfer</div>
                        <div className="text-2xl font-bold text-orange-400">
                          {inventory.currency.copper || 0}
                        </div>
                      </div>
                    </div>

                    {/* Currency Converter */}
                    <div className="mt-4 pt-4 border-t border-yellow-700/30">
                      <div className="text-xs text-gray-400 mb-2">
                        Gesamtwert in Gold:
                      </div>
                      <div className="text-xl font-bold text-yellow-400">
                        {(
                          (inventory.currency.platinum || 0) * 10 +
                          (inventory.currency.gold || 0) +
                          (inventory.currency.silver || 0) / 10 +
                          (inventory.currency.copper || 0) / 100
                        ).toFixed(2)}{" "}
                        GP
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 Platin = 10 Gold | 1 Gold = 10 Silber | 1 Silber = 10
                        Kupfer
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-6 h-6 text-purple-400" />
                      <h4 className="text-lg font-bold text-white">
                        Gegenstände
                      </h4>
                    </div>

                    {inventory.items && inventory.items.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {inventory.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 hover:border-purple-500/50 transition-colors"
                          >
                            <div className="flex gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-contain bg-black/20 rounded border border-gray-700"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/64x64?text=Item";
                                  }}
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-bold text-white">
                                    {item.name}
                                  </h5>
                                  {item.quantity > 1 && (
                                    <span className="text-xs px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded">
                                      x{item.quantity}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-400">
                                    {item.description}
                                  </p>
                                )}
                                {item.category && (
                                  <span className="text-xs text-gray-500 mt-1 inline-block">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-30" />
                        <p className="text-gray-400 text-sm">
                          Keine Gegenstände im Inventar
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerSideMenu;
