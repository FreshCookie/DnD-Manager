import React, { useState } from "react";
import { useHexagon } from "../contexts/HexagonContext";
import { Search, Clock, Users, ArrowRight, X } from "lucide-react";

const ExplorationPanel = ({ hex, onClose }) => {
  const { players, setPlayers, updateHex, advanceTime } = useHexagon();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [explorationRounds, setExplorationRounds] = useState(1); // 1-5 Runden

  // Berechne Erkundungszeit basierend auf Gelände
  const calculateExplorationTime = (hexType, rounds) => {
    const baseTime = {
      plain: 2, // Ebene: 2h
      forest: 3, // Wald: 3h
      mountain: 4, // Berge: 4h
      desert: 3, // Wüste: 3h
      water: 2, // Wasser: 2h
      city: 1, // Stadt: 1h
      dungeon: 5, // Dungeon: 5h
    };
    return (baseTime[hexType] || 2) * rounds;
  };

  // Finde Spieler auf diesem Hex
  const playersOnHex = players.filter(
    (p) => p.position.q === hex.q && p.position.r === hex.r
  );

  // Spieler für Erkundung auswählen/abwählen
  const togglePlayerSelection = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Erkundung starten
  const startExploration = () => {
    if (selectedPlayers.length === 0) {
      alert("Wähle mindestens einen Spieler aus!");
      return;
    }

    if (playersOnHex.length === 0) {
      alert(
        "Es sind keine Spieler auf diesem Hex! Bewege zuerst Spieler hierher."
      );
      return;
    }

    const totalTime = calculateExplorationTime(hex.type, explorationRounds);

    // Spieler-Status aktualisieren
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        selectedPlayers.includes(player.id)
          ? { ...player, status: "exploring" }
          : player
      )
    );

    // Hex als besucht markieren und Erkundungslevel erhöhen
    const currentExplorationLevel = hex.explorationLevel || 0;
    const newExplorationLevel = Math.min(
      5,
      currentExplorationLevel + explorationRounds
    );

    updateHex(hex.q, hex.r, {
      visited: true,
      explorationLevel: newExplorationLevel,
    });

    // Zeit voranschreiten
    advanceTime(totalTime * 60); // Stunden in Minuten

    // Zufälliges Ergebnis generieren
    const outcomes = generateExplorationOutcome(
      hex,
      selectedPlayers.length,
      explorationRounds
    );

    // Ergebnis anzeigen
    setTimeout(() => {
      alert(
        `Erkundung abgeschlossen!\n\n${outcomes.message}\n\nErkundungslevel: ${newExplorationLevel}/5\nZeit vergangen: ${totalTime}h`
      );

      // Spieler-Status zurücksetzen
      setPlayers((prev) =>
        prev.map((p) =>
          selectedPlayers.includes(p.id) ? { ...p, status: "idle" } : p
        )
      );

      onClose();
    }, 500);
  };

  // Erkundungs-Ergebnis generieren
  const generateExplorationOutcome = (hex, playerCount) => {
    const roll = Math.random();
    let message = "";

    // Basis auf Hex-Typ
    switch (hex.type) {
      case "forest":
        if (roll > 0.7) {
          message = "Ihr findet seltene Kräuter und Heilpflanzen!";
        } else if (roll > 0.4) {
          message = "Ein friedlicher Wald. Nichts besonderes gefunden.";
        } else {
          message = "Achtung! Wilde Tiere im Gebiet gesichtet!";
        }
        break;

      case "mountain":
        if (roll > 0.7) {
          message = "Ihr entdeckt eine verborgene Höhle mit Erzen!";
        } else if (roll > 0.4) {
          message = "Gefährliches Gelände, aber keine Funde.";
        } else {
          message = "Ein Erdrutsch! Die Gruppe nimmt leichten Schaden.";
        }
        break;

      case "city":
        message = "Ihr erreicht die Stadt und könnt Handel treiben.";
        break;

      case "dungeon":
        if (roll > 0.5) {
          message =
            "Ihr findet den Eingang zum Dungeon! Bereitet euch auf Kämpfe vor.";
        } else {
          message = "Der Dungeon ist bewacht! Feindliche Kreaturen entdeckt.";
        }
        break;

      case "water":
        message = "Ihr erreicht ein Gewässer. Überquerung nicht möglich.";
        break;

      case "desert":
        if (roll > 0.6) {
          message = "Ihr findet eine Oase und könnt Wasser auffüllen.";
        } else {
          message = "Die Hitze setzt euch zu. Ausdauer der Gruppe reduziert.";
        }
        break;

      default:
        if (roll > 0.8) {
          message = "Ihr findet etwas Interessantes!";
        } else if (roll > 0.5) {
          message = "Nichts besonderes entdeckt.";
        } else {
          message = "Die Gruppe wirkt erschöpft von der Reise.";
        }
    }

    // Gruppen-Bonus
    if (playerCount >= 3) {
      message += "\n[Gruppen-Bonus: +20% Erfolgsrate]";
    }

    return { message };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Erkundung starten
              </h2>
              <p className="text-sm text-purple-100">
                {hex.name || `Hex (${hex.q}, ${hex.r})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hex Info */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Hex-Informationen</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Typ:</span>
                <span className="ml-2 text-white capitalize">
                  {hex.type === "empty" ? "Unbekannt" : hex.type}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Gefahrenstufe:</span>
                <span className="ml-2 text-white">{hex.danger}/5</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 text-white">
                  {hex.visited ? "Besucht" : "Unerkundet"}
                </span>
              </div>
            </div>
          </div>

          {/* Spieler-Auswahl - nur Spieler auf diesem Hex */}
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Spieler auf diesem Hex ({playersOnHex.length})
            </h3>

            {playersOnHex.length === 0 ? (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
                ⚠️ Keine Spieler auf diesem Hex! Bewege zuerst Spieler hierher,
                bevor du erkunden kannst.
              </div>
            ) : (
              <div className="space-y-2">
                {playersOnHex.map((player) => {
                  const isSelected = selectedPlayers.includes(player.id);
                  const isAvailable = player.status === "idle";

                  return (
                    <div
                      key={player.id}
                      onClick={() =>
                        isAvailable && togglePlayerSelection(player.id)
                      }
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-600 border-purple-400"
                          : isAvailable
                          ? "bg-gray-700 border-gray-600 hover:border-purple-500"
                          : "bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white"
                          style={{ backgroundColor: player.color }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Level {player.level} | HP: {player.hp}/
                            {player.maxHp}
                            {!isAvailable && " (Beschäftigt)"}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="bg-white rounded-full p-1">
                            <ArrowRight className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Erkundungsrunden */}
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Erkundungsrunden (max 5 pro Hex)
            </h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={explorationRounds}
                  onChange={(e) => setExplorationRounds(Number(e.target.value))}
                  className="flex-1"
                  disabled={playersOnHex.length === 0}
                />
                <div className="text-white font-bold text-lg min-w-[100px] text-right">
                  {explorationRounds} Runde{explorationRounds > 1 ? "n" : ""}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Aktuelle Erkundung: {hex.explorationLevel || 0}/5 | Nach
                Erkundung:{" "}
                {Math.min(5, (hex.explorationLevel || 0) + explorationRounds)}/5
              </div>
              <div className="text-xs text-purple-300 mt-2">
                Gesamtzeit:{" "}
                {calculateExplorationTime(hex.type, explorationRounds)}h (
                {hex.type === "plain"
                  ? "Ebene"
                  : hex.type === "forest"
                  ? "Wald"
                  : hex.type === "mountain"
                  ? "Gebirge"
                  : hex.type === "dungeon"
                  ? "Dungeon"
                  : hex.type === "desert"
                  ? "Wüste"
                  : hex.type === "water"
                  ? "Wasser"
                  : hex.type === "city"
                  ? "Stadt"
                  : "Standard"}
                )
              </div>
            </div>
          </div>

          {/* Warnung */}
          {hex.danger > 2 && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
              <p className="text-red-300 text-sm">
                ⚠️ <strong>Achtung:</strong> Dieses Gebiet hat eine hohe
                Gefahrenstufe! Kämpfe sind wahrscheinlich.
              </p>
            </div>
          )}

          {/* Aktionen */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={startExploration}
              disabled={
                selectedPlayers.length === 0 || playersOnHex.length === 0
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Erkundung starten ({selectedPlayers.length} Spieler)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationPanel;
