import React, { useState } from "react";
import { useHexagon } from "../contexts/HexagonContext";
import SkillTreeModal from "./SkillTreeModal";
import PlayerEditModal from "./PlayerEditModal";
import {
  User,
  Shield,
  Sword,
  Package,
  TrendingUp,
  Heart,
  Zap,
  Star,
  Edit,
} from "lucide-react";

const PlayerManagement = () => {
  const { players } = useHexagon();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-purple-400" />
        Spieler-Verwaltung
      </h2>

      {/* Spieler-Liste */}
      <div className="space-y-2 mb-4">
        {players.map((player) => (
          <div
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedPlayer?.id === player.id
                ? "bg-purple-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Spieler-Farbe */}
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: player.color }}
              />

              {/* Name & Level */}
              <div className="flex-1">
                <div className="font-semibold text-white">{player.name}</div>
                <div className="text-xs text-gray-400">
                  Level {player.level} | Pos: {player.position.q},
                  {player.position.r}
                </div>
              </div>

              {/* HP Bar */}
              <div className="w-24">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Heart className="w-3 h-3" />
                  <span>
                    {player.hp}/{player.maxHp}
                  </span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailansicht */}
      {selectedPlayer && (
        <div className="border-t border-gray-700 pt-4 space-y-4">
          {/* Header mit Edit-Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {selectedPlayer.name}
            </h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition-colors"
            >
              <Edit className="w-4 h-4" />
              Bearbeiten
            </button>
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-400">
                SPECIAL Stats
              </h3>
              {selectedPlayer.availableSkillPoints > 0 && (
                <button
                  onClick={() => setShowSkillTree(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  {selectedPlayer.availableSkillPoints}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedPlayer.special).map(([stat, value]) => (
                <div key={stat} className="bg-gray-700 rounded p-2">
                  <div className="text-xs text-gray-400 uppercase">
                    {stat.charAt(0)}
                  </div>
                  <div className="text-lg font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ausrüstung */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Shield className="w-4 h-4" /> Ausrüstung
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Waffe:</span>
                <span className="text-white">
                  {selectedPlayer.equipment.weapon?.name || "Keine"}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Rüstung:</span>
                <span className="text-white">
                  {selectedPlayer.equipment.armor?.name || "Keine"}
                </span>
              </div>
            </div>
          </div>

          {/* EXP */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Erfahrung
            </h3>
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3"
                style={{
                  width: `${
                    (selectedPlayer.exp / selectedPlayer.expToNextLevel) * 100
                  }%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              {selectedPlayer.exp} / {selectedPlayer.expToNextLevel} EXP
            </div>
          </div>

          {/* Inventar */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Package className="w-4 h-4" /> Inventar (
              {selectedPlayer.inventory.length}/
              {selectedPlayer.maxInventorySlots})
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {selectedPlayer.inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded p-2 text-center aspect-square flex items-center justify-center"
                  title={item.name}
                >
                  <div className="text-xs text-white truncate">{item.name}</div>
                </div>
              ))}
              {/* Leere Slots */}
              {Array.from({
                length:
                  selectedPlayer.maxInventorySlots -
                  selectedPlayer.inventory.length,
              }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-gray-900 rounded aspect-square border border-gray-700"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skill Tree Modal */}
      {showSkillTree && selectedPlayer && (
        <SkillTreeModal
          player={selectedPlayer}
          onClose={() => setShowSkillTree(false)}
        />
      )}

      {/* Player Edit Modal */}
      {showEditModal && selectedPlayer && (
        <PlayerEditModal
          player={selectedPlayer}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default PlayerManagement;
