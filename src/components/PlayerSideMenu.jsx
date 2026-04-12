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
  Sparkles,
  Image as ImageIcon,
  Sword,
  Users,
  TrendingUp,
} from "lucide-react";

const PlayerSideMenu = ({ isOpen, onClose, character, characterData }) => {
  const [activeTab, setActiveTab] = useState("character");
  const [editForm, setEditForm] = useState({
    name: "",
    class: "",
    race: "",
    background: "",
    level: "",
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
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [editInventory, setEditInventory] = useState({
    items: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
  });
  const [pendingInventoryChanges, setPendingInventoryChanges] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    image: "",
    quantity: 1,
    category: "",
  });
  const [abilities, setAbilities] = useState([]);
  const [isLoadingAbilities, setIsLoadingAbilities] = useState(false);
  const [isAddingAbility, setIsAddingAbility] = useState(false);
  const [editingAbility, setEditingAbility] = useState(null);
  const [abilityForm, setAbilityForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Initialize form when characterData changes
  useEffect(() => {
    if (characterData) {
      setEditForm({
        name: characterData.name || "",
        class: characterData.class || "",
        race: characterData.race || "",
        background: characterData.background || characterData.description || "",
        level: characterData.level || "",
      });
    }
  }, [characterData]);

  // Load notes when tab changes to notes
  useEffect(() => {
    if (activeTab === "notes" && character) {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, character]);

  const fetchNotes = async () => {
    if (!character) return;

    setIsLoadingNotes(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
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
      fetchPendingChanges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, character]);

  const fetchInventory = async () => {
    if (!character) return;

    setIsLoadingInventory(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
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
      const inventoryData = data.inventory || {
        items: [],
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
      };
      setInventory(inventoryData);
      setEditInventory(JSON.parse(JSON.stringify(inventoryData))); // Deep copy
    } catch (error) {
      console.error("Fehler beim Laden des Inventars:", error);
      alert("Fehler beim Laden des Inventars");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const fetchPendingChanges = async () => {
    if (!character) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/inventory-changes/pending`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        // If user is player and gets 403, that's expected (only GMs can see all)
        // Players will only see their own pending when they submit
        if (response.status === 403) {
          setPendingInventoryChanges([]);
          return;
        }
        throw new Error("Fehler beim Laden der ausstehenden Änderungen");
      }

      const data = await response.json();
      // Filter to only show changes for this character
      const myChanges = data.changes.filter((c) => c.playerId === character);
      setPendingInventoryChanges(myChanges || []);
    } catch (error) {
      console.error("Fehler beim Laden der ausstehenden Änderungen:", error);
      // Don't alert here, as players will get 403
    }
  };

  // Load abilities when tab changes to abilities
  useEffect(() => {
    if (activeTab === "abilities" && character) {
      fetchAbilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, character]);

  const fetchAbilities = async () => {
    if (!character) return;

    setIsLoadingAbilities(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/abilities`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Fähigkeiten");
      }

      const data = await response.json();
      setAbilities(data.abilities || []);
    } catch (error) {
      console.error("Fehler beim Laden der Fähigkeiten:", error);
      alert("Fehler beim Laden der Fähigkeiten");
    } finally {
      setIsLoadingAbilities(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteForm.title.trim()) {
      alert("Titel ist erforderlich!");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
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
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
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

  // Abilities functions
  const handleSaveAbility = async () => {
    if (!abilityForm.name.trim()) {
      alert("Name ist erforderlich!");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const url = editingAbility
        ? `${API_BASE_URL}/api/characters/${character}/abilities/${editingAbility.id}`
        : `${API_BASE_URL}/api/characters/${character}/abilities`;

      const response = await fetch(url, {
        method: editingAbility ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(abilityForm),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Fähigkeit");
      }

      alert(editingAbility ? "Fähigkeit aktualisiert!" : "Fähigkeit erstellt!");
      setAbilityForm({ name: "", description: "", image: "" });
      setIsAddingAbility(false);
      setEditingAbility(null);
      fetchAbilities(); // Reload abilities
    } catch (error) {
      console.error("Fehler beim Speichern der Fähigkeit:", error);
      alert("Fehler beim Speichern der Fähigkeit. Bitte versuche es erneut.");
    }
  };

  const handleEditAbility = (ability) => {
    setEditingAbility(ability);
    setAbilityForm({
      name: ability.name,
      description: ability.description || "",
      image: ability.image || "",
    });
    setIsAddingAbility(true);
  };

  const handleDeleteAbility = async (abilityId) => {
    if (!confirm("Möchtest du diese Fähigkeit wirklich löschen?")) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/abilities/${abilityId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Fähigkeit");
      }

      alert("Fähigkeit gelöscht!");
      fetchAbilities(); // Reload abilities
    } catch (error) {
      console.error("Fehler beim Löschen der Fähigkeit:", error);
      alert("Fehler beim Löschen der Fähigkeit. Bitte versuche es erneut.");
    }
  };

  const handleCancelAbility = () => {
    setAbilityForm({ name: "", description: "", image: "" });
    setIsAddingAbility(false);
    setEditingAbility(null);
  };

  // Inventory Edit Handlers
  const handleStartEditInventory = () => {
    setEditInventory(JSON.parse(JSON.stringify(inventory))); // Deep copy
    setIsEditingInventory(true);
  };

  const handleCancelEditInventory = () => {
    setEditInventory(JSON.parse(JSON.stringify(inventory))); // Reset to original
    setIsEditingInventory(false);
    setItemForm({
      name: "",
      description: "",
      image: "",
      quantity: 1,
      category: "",
    });
    setEditingItem(null);
  };

  const handleSubmitInventoryChange = async () => {
    if (!confirm("Möchtest du diese Änderungen zur Genehmigung einreichen?")) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/characters/${character}/inventory-changes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            items: editInventory.items,
            currency: editInventory.currency,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Einreichen der Änderung");
      }

      alert("Änderungsantrag eingereicht! Warte auf GM-Genehmigung.");
      setIsEditingInventory(false);
      fetchPendingChanges(); // Reload pending changes
    } catch (error) {
      console.error("Fehler beim Einreichen der Änderung:", error);
      alert("Fehler beim Einreichen der Änderung. Bitte versuche es erneut.");
    }
  };

  const handleAddItem = () => {
    setItemForm({
      name: "",
      description: "",
      image: "",
      quantity: 1,
      category: "",
    });
    setEditingItem("new");
  };

  const handleEditItem = (item) => {
    setItemForm({ ...item });
    setEditingItem(item.id);
  };

  const handleSaveItem = () => {
    if (!itemForm.name.trim()) {
      alert("Itemname ist erforderlich!");
      return;
    }

    if (editingItem === "new") {
      // Add new item
      const newItem = {
        id: `item-${Date.now()}`,
        name: itemForm.name,
        description: itemForm.description,
        image: itemForm.image,
        quantity: parseInt(itemForm.quantity) || 1,
        category: itemForm.category,
      };
      setEditInventory({
        ...editInventory,
        items: [...editInventory.items, newItem],
      });
    } else {
      // Update existing item
      setEditInventory({
        ...editInventory,
        items: editInventory.items.map((item) =>
          item.id === editingItem ? { ...item, ...itemForm } : item,
        ),
      });
    }

    setItemForm({
      name: "",
      description: "",
      image: "",
      quantity: 1,
      category: "",
    });
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (!confirm("Möchtest du dieses Item wirklich löschen?")) {
      return;
    }

    setEditInventory({
      ...editInventory,
      items: editInventory.items.filter((item) => item.id !== itemId),
    });
  };

  const handleCancelEditItem = () => {
    setItemForm({
      name: "",
      description: "",
      image: "",
      quantity: 1,
      category: "",
    });
    setEditingItem(null);
  };

  const handleSaveChanges = async () => {
    if (!editForm.name.trim()) {
      alert("Charaktername ist erforderlich!");
      return;
    }

    setIsSaving(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
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
      });
    }
    setActiveTab("character");
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "character", label: "Mein Charakter", icon: User },
    { id: "edit", label: "Bearbeiten", icon: Edit },
    { id: "abilities", label: "Fähigkeiten", icon: Sparkles },
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
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl"></div>
                        <img
                          src={characterData.image}
                          alt={characterData.name}
                          className="relative w-48 h-48 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Character Name */}
                  <div className="text-center space-y-2">
                    <h3 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                      {characterData.name}
                    </h3>
                  </div>

                  {/* Character Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Class */}
                    {characterData.class && (
                      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sword className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-400">
                            Klasse
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white">
                          {characterData.class}
                        </div>
                      </div>
                    )}

                    {/* Race */}
                    {characterData.race && (
                      <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border border-pink-500/30 rounded-xl p-4 hover:border-pink-400/50 transition-all duration-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-pink-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-pink-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-400">
                            Rasse
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white">
                          {characterData.race}
                        </div>
                      </div>
                    )}

                    {/* Level */}
                    {characterData.level && (
                      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 hover:border-blue-400/50 transition-all duration-200 col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-400">
                            Level
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {characterData.level}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Story */}
                  {characterData.background && (
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-600/30 rounded-xl p-5 shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-700/50 rounded-lg">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-200">
                          Background Story
                        </h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {characterData.background}
                      </p>
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

          {/* Fähigkeiten Tab */}
          {activeTab === "abilities" && (
            <div className="space-y-4">
              {/* Add Ability Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  Meine Fähigkeiten
                </h3>
                <button
                  onClick={() => setIsAddingAbility(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Neue Fähigkeit
                </button>
              </div>

              {/* Add/Edit Ability Form */}
              {isAddingAbility && (
                <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-lg font-bold text-white mb-4">
                    {editingAbility ? "Fähigkeit bearbeiten" : "Neue Fähigkeit"}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={abilityForm.name}
                        onChange={(e) =>
                          setAbilityForm({
                            ...abilityForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="z.B. Feuerzauber"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Beschreibung
                      </label>
                      <textarea
                        value={abilityForm.description}
                        onChange={(e) =>
                          setAbilityForm({
                            ...abilityForm,
                            description: e.target.value,
                          })
                        }
                        rows="4"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Beschreibe die Fähigkeit..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bild-URL (optional)
                      </label>
                      <div className="flex gap-2">
                        <ImageIcon className="w-5 h-5 text-gray-400 mt-2" />
                        <input
                          type="text"
                          value={abilityForm.image}
                          onChange={(e) =>
                            setAbilityForm({
                              ...abilityForm,
                              image: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="z.B. /public/images/abilities/fire.jpg"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={handleSaveAbility}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        Speichern
                      </button>
                      <button
                        onClick={handleCancelAbility}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Abilities List */}
              {isLoadingAbilities ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Lade Fähigkeiten...</p>
                </div>
              ) : abilities.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-purple-500/30">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">
                    Noch keine Fähigkeiten erstellt
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Erstelle deine erste Fähigkeit!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {abilities.map((ability) => (
                    <div
                      key={ability.id}
                      className="bg-gray-800 rounded-lg p-4 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {ability.image && (
                              <img
                                src={ability.image}
                                alt={ability.name}
                                className="w-12 h-12 rounded object-cover border border-purple-500/30"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                            <h4 className="text-lg font-bold text-white">
                              {ability.name}
                            </h4>
                          </div>
                          {ability.description && (
                            <p className="text-gray-300 text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                              {ability.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(ability.createdAt).toLocaleDateString(
                              "de-DE",
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditAbility(ability)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            title="Bearbeiten"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAbility(ability.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {/* Header with Edit Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Mein Inventar</h3>
                {!isEditingInventory ? (
                  <button
                    onClick={handleStartEditInventory}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Bearbeiten
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitInventoryChange}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Einreichen
                    </button>
                    <button
                      onClick={handleCancelEditInventory}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Abbrechen
                    </button>
                  </div>
                )}
              </div>

              {/* Pending Changes Banner */}
              {pendingInventoryChanges.length > 0 && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-400">⏳</div>
                    <div>
                      <p className="text-sm font-medium text-yellow-200">
                        {pendingInventoryChanges.length} Änderung
                        {pendingInventoryChanges.length > 1 ? "en" : ""} wartet
                        auf GM-Genehmigung
                      </p>
                      <p className="text-xs text-yellow-300/70 mt-1">
                        Deine eingereichten Änderungen werden bald vom GM
                        überprüft.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

                    {isEditingInventory ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <label className="text-xs text-gray-400 mb-2 block">
                            Platin
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editInventory.currency.platinum}
                            onChange={(e) =>
                              setEditInventory({
                                ...editInventory,
                                currency: {
                                  ...editInventory.currency,
                                  platinum: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-purple-300 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <label className="text-xs text-gray-400 mb-2 block">
                            Gold
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editInventory.currency.gold}
                            onChange={(e) =>
                              setEditInventory({
                                ...editInventory,
                                currency: {
                                  ...editInventory.currency,
                                  gold: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-yellow-400 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <label className="text-xs text-gray-400 mb-2 block">
                            Silber
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editInventory.currency.silver}
                            onChange={(e) =>
                              setEditInventory({
                                ...editInventory,
                                currency: {
                                  ...editInventory.currency,
                                  silver: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-gray-300 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gray-500"
                          />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <label className="text-xs text-gray-400 mb-2 block">
                            Kupfer
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editInventory.currency.copper}
                            onChange={(e) =>
                              setEditInventory({
                                ...editInventory,
                                currency: {
                                  ...editInventory.currency,
                                  copper: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-orange-400 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <div className="text-xs text-gray-400 mb-1">
                            Platin
                          </div>
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
                          <div className="text-xs text-gray-400 mb-1">
                            Silber
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            {inventory.currency.silver || 0}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <div className="text-xs text-gray-400 mb-1">
                            Kupfer
                          </div>
                          <div className="text-2xl font-bold text-orange-400">
                            {inventory.currency.copper || 0}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Currency Converter */}
                    <div className="mt-4 pt-4 border-t border-yellow-700/30">
                      <div className="text-xs text-gray-400 mb-2">
                        Gesamtwert in Gold:
                      </div>
                      <div className="text-xl font-bold text-yellow-400">
                        {(
                          (isEditingInventory ? editInventory : inventory)
                            .currency.platinum *
                            10 +
                          (isEditingInventory ? editInventory : inventory)
                            .currency.gold +
                          (isEditingInventory ? editInventory : inventory)
                            .currency.silver /
                            10 +
                          (isEditingInventory ? editInventory : inventory)
                            .currency.copper /
                            100
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-purple-400" />
                        <h4 className="text-lg font-bold text-white">
                          Gegenstände
                        </h4>
                      </div>
                      {isEditingInventory && (
                        <button
                          onClick={handleAddItem}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Item
                        </button>
                      )}
                    </div>

                    {/* Add/Edit Item Form */}
                    {editingItem && (
                      <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-purple-500/30">
                        <h5 className="text-sm font-bold text-purple-300 mb-3">
                          {editingItem === "new"
                            ? "Neues Item hinzufügen"
                            : "Item bearbeiten"}
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={itemForm.name}
                              onChange={(e) =>
                                setItemForm({
                                  ...itemForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="z.B. Langschwert"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              Beschreibung
                            </label>
                            <textarea
                              value={itemForm.description}
                              onChange={(e) =>
                                setItemForm({
                                  ...itemForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              rows="2"
                              placeholder="Beschreibung des Items..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">
                                Anzahl
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={itemForm.quantity}
                                onChange={(e) =>
                                  setItemForm({
                                    ...itemForm,
                                    quantity: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">
                                Kategorie
                              </label>
                              <input
                                type="text"
                                value={itemForm.category}
                                onChange={(e) =>
                                  setItemForm({
                                    ...itemForm,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="z.B. Waffe"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              Bild-URL (optional)
                            </label>
                            <input
                              type="text"
                              value={itemForm.image}
                              onChange={(e) =>
                                setItemForm({
                                  ...itemForm,
                                  image: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleCancelEditItem}
                              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                              Abbrechen
                            </button>
                            <button
                              onClick={handleSaveItem}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Speichern
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    {(isEditingInventory ? editInventory : inventory).items &&
                    (isEditingInventory ? editInventory : inventory).items
                      .length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {(isEditingInventory
                          ? editInventory
                          : inventory
                        ).items.map((item) => (
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
                                  <div className="flex items-center gap-2">
                                    {item.quantity > 1 && (
                                      <span className="text-xs px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded">
                                        x{item.quantity}
                                      </span>
                                    )}
                                    {isEditingInventory && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleEditItem(item)}
                                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteItem(item.id)
                                          }
                                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
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
                          {isEditingInventory
                            ? 'Noch keine Gegenstände. Klicke auf "+ Item"!'
                            : "Keine Gegenstände im Inventar"}
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
