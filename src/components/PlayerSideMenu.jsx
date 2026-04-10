import React, { useState, useEffect } from "react";
import { X, User, Edit, BookOpen, Package, Save } from "lucide-react";

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
        }
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
            <div className="text-center text-gray-400 py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Meine Notizen</p>
              <p className="text-sm">Wird in Phase 2 implementiert</p>
            </div>
          )}

          {/* Inventar Tab */}
          {activeTab === "inventory" && (
            <div className="text-center text-gray-400 py-12">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Mein Inventar</p>
              <p className="text-sm">Wird in Phase 4 implementiert</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerSideMenu;
