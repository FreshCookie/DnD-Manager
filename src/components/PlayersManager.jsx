import React, { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Heart,
  Eye,
  Sword,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";
import PlayerDetailsModal from "./PlayerDetailsModal";

const PlayersManager = ({ theme }) => {
  const { players, setPlayers, companions, activePlayers, setActivePlayers } =
    useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
          p.id === editingPlayer.id ? { ...formData, id: editingPlayer.id } : p,
        ),
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
              } border-2 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                isActive ? "ring-2 ring-green-500" : ""
              }`}
            >
              {/* Character Image - Click to open details */}
              <div
                onClick={() => setSelectedPlayer(player)}
                className="relative group"
              >
                {player.image ? (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-64 object-contain bg-black/20"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x400?text=No+Image")
                    }
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Users className={`${theme.text} w-24 h-24 opacity-20`} />
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white font-semibold">Details anzeigen</p>
                  </div>
                </div>
                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    In Session
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Name & Active Toggle */}
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`${theme.text} text-xl font-bold`}>
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sword className={`${theme.accent} w-4 h-4`} />
                    <span className={`${theme.text} text-sm`}>
                      {player.class || "Keine Klasse"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`${theme.accent} w-4 h-4`} />
                    <span className={`${theme.text} text-sm`}>
                      {player.race || "Keine Rasse"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`${theme.accent} w-4 h-4`} />
                    <span className={`${theme.text} text-sm`}>
                      Level {player.level || "1"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className={`${theme.accent} w-4 h-4`} />
                    <span className={`${theme.text} text-sm`}>
                      {player.hp || player.maxHp || "10"} /{" "}
                      {player.maxHp || "10"} HP
                    </span>
                  </div>
                </div>

                {/* Alignment Badge */}
                {player.alignment && (
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className={`${theme.accent} w-4 h-4`} />
                    <span
                      className={`${theme.text} text-xs px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded`}
                    >
                      {player.alignment}
                    </span>
                  </div>
                )}

                {/* Description Preview */}
                {(player.description || player.background) && (
                  <p
                    className={`${theme.text} text-sm opacity-70 mb-3 line-clamp-2`}
                  >
                    {player.background || player.description}
                  </p>
                )}

                {/* Companion */}
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPlayer(player)}
                    className={`${theme.button} flex-1 px-3 py-2 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Details</span>
                  </button>
                  <button
                    onClick={() => handleEdit(player)}
                    className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
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
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Spieler vorhanden. Erstelle deinen ersten Spieler!
        </div>
      )}

      {/* Player Details Modal */}
      <PlayerDetailsModal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        player={selectedPlayer}
        companion={
          selectedPlayer ? getCompanionById(selectedPlayer.companionId) : null
        }
        theme={theme}
      />
    </div>
  );
};

export default PlayersManager;
