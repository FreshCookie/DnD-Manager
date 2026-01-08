import React, { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Heart,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";

const PlayersManager = ({ theme }) => {
  const { players, setPlayers, companions, activePlayers, setActivePlayers } =
    useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    companionId: "",
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "", companionId: "" });
    setIsAdding(false);
    setEditingPlayer(null);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name ist ein Pflichtfeld!");
      return;
    }

    if (editingPlayer) {
      setPlayers(
        players.map((p) =>
          p.id === editingPlayer.id ? { ...formData, id: editingPlayer.id } : p
        )
      );
    } else {
      const newPlayer = {
        ...formData,
        id: generateId(),
        createdAt: Date.now(),
      };
      setPlayers([...players, newPlayer]);
    }
    resetForm();
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      description: player.description || "",
      image: player.image || "",
      companionId: player.companionId || "",
    });
    setIsAdding(true);
  };

  const handleDelete = (playerId) => {
    if (window.confirm("Möchtest du diesen Spieler wirklich löschen?")) {
      setPlayers(players.filter((p) => p.id !== playerId));
      // Entferne auch aus aktivePlayers
      setActivePlayers(activePlayers.filter((id) => id !== playerId));
    }
  };

  const toggleActivePlayer = (playerId) => {
    if (activePlayers.includes(playerId)) {
      setActivePlayers(activePlayers.filter((id) => id !== playerId));
    } else {
      setActivePlayers([...activePlayers, playerId]);
    }
  };

  const getCompanionById = (companionId) => {
    return companions.find((c) => c.id === companionId);
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-2xl font-bold`}>Spieler</h3>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`${theme.button} px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold`}
        >
          <Plus className="w-5 h-5" /> Spieler hinzufügen
        </button>
      </div>

      {/* Aktive Spieler Anzeige */}
      {activePlayers.length > 0 && (
        <div
          className={`${theme.cardBg} ${theme.border} border rounded-lg p-4 mb-6`}
        >
          <h4 className={`${theme.text} font-semibold mb-2`}>
            🎮 Aktive Session ({activePlayers.length} Spieler):
          </h4>
          <div className="flex flex-wrap gap-2">
            {activePlayers.map((playerId) => {
              const player = players.find((p) => p.id === playerId);
              return player ? (
                <div
                  key={playerId}
                  className={`${theme.accent} text-sm px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full`}
                >
                  ✓ {player.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {isAdding && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-6 mb-6`}
        >
          <h4 className={`${theme.text} text-lg font-bold mb-4`}>
            {editingPlayer ? "Spieler bearbeiten" : "Neuer Spieler"}
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
                placeholder="z.B. Max Mustermann"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Beschreibung / Charakter
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Klasse, Eigenschaften, Hintergrund..."
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
                placeholder="/images/players/max.jpg"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Companion
              </label>
              <select
                value={formData.companionId}
                onChange={(e) =>
                  setFormData({ ...formData, companionId: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Kein Companion</option>
                {companions.map((companion) => (
                  <option key={companion.id} value={companion.id}>
                    {companion.name}
                  </option>
                ))}
              </select>
              {companions.length === 0 && (
                <p className={`${theme.text} text-xs opacity-50 mt-1`}>
                  Erstelle erst Companions im "Companions" Tab
                </p>
              )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => {
          const isActive = activePlayers.includes(player.id);
          const companion = getCompanionById(player.companionId);

          return (
            <div
              key={player.id}
              className={`${theme.cardBg} ${
                theme.border
              } border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
                isActive ? "ring-2 ring-green-500" : ""
              }`}
            >
              {player.image && (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-48 object-contain bg-black/20 rounded-lg mb-3"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <h4 className={`${theme.text} text-lg font-bold`}>
                  {player.name}
                </h4>
                <button
                  onClick={() => toggleActivePlayer(player.id)}
                  className={`${
                    isActive ? "text-green-400" : "text-gray-500"
                  } hover:scale-110 transition-all`}
                  title={isActive ? "In Session" : "Nicht in Session"}
                >
                  {isActive ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>

              {player.description && (
                <p
                  className={`${theme.text} text-sm opacity-70 mb-3 line-clamp-2`}
                >
                  {player.description}
                </p>
              )}

              {companion && (
                <div className="mb-3 p-2 bg-purple-900/30 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <Heart className={`${theme.accent} w-4 h-4`} />
                    <span className={`${theme.text} text-sm font-semibold`}>
                      {companion.name}
                    </span>
                  </div>
                  {companion.ability && (
                    <p
                      className={`${theme.text} text-xs opacity-70 mt-1 line-clamp-1`}
                    >
                      {companion.ability}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(player)}
                  className={`${theme.button} flex-1 px-3 py-2 rounded-lg transition-all hover:scale-105`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Spieler vorhanden. Erstelle deinen ersten Spieler!
        </div>
      )}
    </div>
  );
};

export default PlayersManager;
