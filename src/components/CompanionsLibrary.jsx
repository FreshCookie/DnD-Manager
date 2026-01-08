import React, { useState } from "react";
import { Heart, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";

const CompanionsLibrary = ({ theme }) => {
  const { companions, setCompanions, sendToPlayerView } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ability: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", ability: "", image: "" });
    setIsAdding(false);
    setEditingCompanion(null);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name ist ein Pflichtfeld!");
      return;
    }

    if (editingCompanion) {
      setCompanions(
        companions.map((c) =>
          c.id === editingCompanion.id
            ? { ...formData, id: editingCompanion.id }
            : c
        )
      );
    } else {
      const newCompanion = {
        ...formData,
        id: generateId(),
        createdAt: Date.now(),
      };
      setCompanions([...companions, newCompanion]);
    }
    resetForm();
  };

  const handleEdit = (companion) => {
    setEditingCompanion(companion);
    setFormData({
      name: companion.name,
      description: companion.description || "",
      ability: companion.ability || "",
      image: companion.image || "",
    });
    setIsAdding(true);
  };

  const handleDelete = (companionId) => {
    if (window.confirm("Möchtest du diesen Companion wirklich löschen?")) {
      setCompanions(companions.filter((c) => c.id !== companionId));
    }
  };

  const showToPlayers = (companion) => {
    sendToPlayerView({
      type: "companion",
      data: companion,
    });
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-2xl font-bold`}>
            Companions Bibliothek
          </h3>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`${theme.button} px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold`}
        >
          <Plus className="w-5 h-5" /> Companion hinzufügen
        </button>
      </div>

      {isAdding && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-6 mb-6`}
        >
          <h4 className={`${theme.text} text-lg font-bold mb-4`}>
            {editingCompanion ? "Companion bearbeiten" : "Neuer Companion"}
          </h4>
          <div className="space-y-4">
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="z.B. Testgeist"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Ein mystischer Geist der..."
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Fähigkeit
              </label>
              <textarea
                value={formData.ability}
                onChange={(e) =>
                  setFormData({ ...formData, ability: e.target.value })
                }
                rows={2}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Kann Sachen vorab testen..."
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Bild
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="/images/companions/testgeist.jpg"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
              >
                Speichern
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {companions.map((companion) => (
          <div
            key={companion.id}
            className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all`}
          >
            {companion.image && (
              <img
                src={companion.image}
                alt={companion.name}
                className="w-full h-48 object-contain bg-black/20 rounded-lg mb-3"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <h4 className={`${theme.text} text-lg font-bold mb-2`}>
              {companion.name}
            </h4>
            {companion.description && (
              <p className={`${theme.text} text-sm opacity-70 mb-2 `}>
                {companion.description}
              </p>
            )}
            {companion.ability && (
              <div className="mb-3 p-2 bg-purple-900/30 rounded">
                <span className={`${theme.accent} text-xs font-semibold`}>
                  🌟 Fähigkeit:
                </span>
                <p className={`${theme.text} text-xs mt-1`}>
                  {companion.ability}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => showToPlayers(companion)}
                className={`${theme.button} flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2`}
              >
                <Eye className="w-4 h-4" /> Zeigen
              </button>
              <button
                onClick={() => handleEdit(companion)}
                className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(companion.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {companions.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Companions vorhanden. Erstelle deinen ersten Companion!
        </div>
      )}
    </div>
  );
};

export default CompanionsLibrary;
