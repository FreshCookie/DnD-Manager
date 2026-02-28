import React from "react";
import { useHexagon } from "../contexts/HexagonContext";
import { increaseSpecialStat } from "../utils/playerHelpers";
import { TrendingUp, X, Star } from "lucide-react";

const SkillTreeModal = ({ player, onClose }) => {
  const { setPlayers } = useHexagon();

  const handleIncreaseSkill = (stat) => {
    const updatedPlayer = increaseSpecialStat(player, stat);
    if (updatedPlayer !== player) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? updatedPlayer : p))
      );
    }
  };

  const getStatDescription = (stat) => {
    const descriptions = {
      strength: "Erhöht Nahkampfschaden und Tragekapazität",
      perception: "Verbessert Erkundung und Fallen-Erkennung",
      endurance: "Erhöht HP und Resistenzen gegen Schaden",
      charisma: "Verbessert Handel und diplomatische Optionen",
      intelligence: "Beschleunigt Lernen und Crafting",
      agility: "Erhöht Initiative und Ausweichen",
      luck: "Verbessert kritische Treffer und Loot-Qualität",
    };
    return descriptions[stat] || "";
  };

  const getStatColor = (value) => {
    if (value >= 9) return "text-purple-400";
    if (value >= 7) return "text-blue-400";
    if (value >= 5) return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Skill-Verteilung</h2>
              <p className="text-sm text-purple-100">
                {player.availableSkillPoints} Punkt
                {player.availableSkillPoints !== 1 ? "e" : ""} verfügbar
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

        <div className="p-6">
          {/* Info */}
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              ℹ️ Verteile deine Skill-Punkte auf die SPECIAL-Attribute. Jedes
              Attribut kann maximal auf 10 erhöht werden.
            </p>
          </div>

          {/* SPECIAL Stats Grid */}
          <div className="space-y-4">
            {Object.entries(player.special).map(([stat, value]) => {
              const canIncrease = player.availableSkillPoints > 0 && value < 10;

              return (
                <div
                  key={stat}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className={`text-4xl font-bold ${getStatColor(
                            value
                          )}`}
                        >
                          {value}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white capitalize">
                            {stat}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {getStatDescription(stat)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleIncreaseSkill(stat)}
                      disabled={!canIncrease}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        canIncrease
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {value >= 10 ? "MAX" : "+1"}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        value >= 9
                          ? "bg-purple-500"
                          : value >= 7
                          ? "bg-blue-500"
                          : value >= 5
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`}
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Keine Punkte mehr */}
          {player.availableSkillPoints === 0 && (
            <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400">
                Keine Skill-Punkte verfügbar. Steige auf, um mehr zu erhalten!
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeModal;
