import React, { useState } from "react";
import { X, Navigation, Search } from "lucide-react";
import { useHexagon } from "../contexts/HexagonContext";

const MovementPanel = ({ selectedHex, onClose }) => {
  const { players, setPlayers, advanceTime } = useHexagon();
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  if (!selectedHex) return null;

  const togglePlayerSelection = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Berechne Bewegungszeit basierend auf Gelände
  const calculateMovementTime = (hexType) => {
    const baseTime = {
      plain: 2, // Ebene: 2h
      forest: 3, // Wald: 3h
      mountain: 5, // Berge: 5h
      desert: 4, // Wüste: 4h
      water: 6, // Wasser: 6h (Schwimmen/Boot)
      city: 1, // Stadt: 1h
      dungeon: 4, // Dungeon: 4h
    };
    return baseTime[hexType] || 3;
  };

  const startMovement = () => {
    if (selectedPlayers.length === 0) {
      alert("Bitte wähle mindestens einen Spieler aus!");
      return;
    }

    const movementTime = calculateMovementTime(selectedHex.type);

    // Bewege Spieler
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        selectedPlayers.includes(player.id)
          ? {
              ...player,
              position: { q: selectedHex.q, r: selectedHex.r },
              status: "idle",
            }
          : player
      )
    );

    // Zeit voranschreiten
    advanceTime(movementTime * 60); // Stunden in Minuten

    alert(
      `${selectedPlayers.length} Spieler zu Hex ${selectedHex.q},${selectedHex.r} bewegt! Zeit vergangen: ${movementTime}h`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-purple-400" />
            Spieler bewegen
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Ziel-Hex Info */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-400">Ziel-Hex:</div>
          <div className="text-xl font-bold text-white">
            {selectedHex.name || `Hex ${selectedHex.q},${selectedHex.r}`}
          </div>
          <div className="text-sm text-purple-300">
            Geländetyp: {selectedHex.type} | Bewegungszeit:{" "}
            {calculateMovementTime(selectedHex.type)}h
          </div>
        </div>

        {/* Spieler-Auswahl */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-400 mb-2">
            Wähle Spieler aus:
          </div>
          <div className="space-y-2">
            {players.map((player) => {
              const isOnHex =
                player.position.q === selectedHex.q &&
                player.position.r === selectedHex.r;
              const isSelected = selectedPlayers.includes(player.id);

              return (
                <button
                  key={player.id}
                  onClick={() => togglePlayerSelection(player.id)}
                  disabled={isOnHex}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    isOnHex
                      ? "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-purple-600 border-purple-400"
                      : "bg-gray-700 border-gray-600 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white">
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {isOnHex
                          ? "Bereits auf diesem Hex"
                          : `Pos: ${player.position.q},${player.position.r}`}
                      </div>
                    </div>
                    {isSelected && !isOnHex && (
                      <div className="text-purple-300">✓</div>
                    )}
                  </div>
                </button>
              );
            })}
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
            onClick={startMovement}
            disabled={selectedPlayers.length === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Bewegen ({selectedPlayers.length} Spieler)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementPanel;
