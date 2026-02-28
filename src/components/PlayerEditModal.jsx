import React, { useState } from "react";
import { X, Upload, User, Star } from "lucide-react";
import { useHexagon } from "../contexts/HexagonContext";

const PlayerEditModal = ({ player, onClose }) => {
  const { setPlayers } = useHexagon();
  const [playerData, setPlayerData] = useState(player);
  const [imagePreview, setImagePreview] = useState(player.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPlayerData({ ...playerData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecialChange = (stat, value) => {
    setPlayerData({
      ...playerData,
      special: {
        ...playerData.special,
        [stat]: Math.max(1, Math.min(10, parseInt(value) || 1)),
      },
    });
  };

  const handleSave = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === player.id ? playerData : p))
    );
    onClose();
  };

  const specialStats = [
    { key: "strength", name: "Stärke", desc: "Nahkampf & Tragen" },
    { key: "perception", name: "Wahrnehmung", desc: "Erkundung & Fallen" },
    { key: "endurance", name: "Ausdauer", desc: "HP & Resistenzen" },
    { key: "charisma", name: "Charisma", desc: "Handel & Diplomatie" },
    { key: "intelligence", name: "Intelligenz", desc: "Crafting & Lernen" },
    { key: "agility", name: "Beweglichkeit", desc: "Initiative & Ausweichen" },
    { key: "luck", name: "Glück", desc: "Kritische Treffer & Loot" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Spieler bearbeiten: {player.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Charakterbild Upload */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-gray-400 mb-2">
            Charakterbild
          </div>
          <div className="flex items-center gap-4">
            {/* Vorschau */}
            <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-600">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Bild hochladen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG oder GIF (max 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* SPECIAL Stats bearbeiten */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            S.P.E.C.I.A.L. Stats
          </div>
          <div className="space-y-3">
            {specialStats.map((stat) => (
              <div key={stat.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {stat.name}
                    </div>
                    <div className="text-xs text-gray-400">{stat.desc}</div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={playerData.special[stat.key]}
                    onChange={(e) =>
                      handleSpecialChange(stat.key, e.target.value)
                    }
                    className="w-16 bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded text-center"
                  />
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(playerData.special[stat.key] / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basis Stats */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-gray-400 mb-3">
            Basis-Werte
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Level</label>
              <input
                type="number"
                min="1"
                value={playerData.level}
                onChange={(e) =>
                  setPlayerData({
                    ...playerData,
                    level: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">HP</label>
              <input
                type="number"
                min="0"
                max={playerData.maxHp}
                value={playerData.hp}
                onChange={(e) =>
                  setPlayerData({
                    ...playerData,
                    hp: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Max HP</label>
              <input
                type="number"
                min="1"
                value={playerData.maxHp}
                onChange={(e) =>
                  setPlayerData({
                    ...playerData,
                    maxHp: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Stamina</label>
              <input
                type="number"
                min="0"
                max={playerData.maxStamina}
                value={playerData.stamina}
                onChange={(e) =>
                  setPlayerData({
                    ...playerData,
                    stamina: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded mt-1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerEditModal;
