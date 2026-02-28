import React from "react";
import { useHexagon } from "../contexts/HexagonContext";
import HexGrid from "./HexGrid";
import {
  User,
  Heart,
  Zap,
  Package,
  Shield,
  Sword,
  TrendingUp,
} from "lucide-react";

const HexagonPlayerView = ({ playerId }) => {
  const { players, getFormattedTime, isNightTime } = useHexagon();

  // Finde den aktuellen Spieler (später wird playerId über URL oder Auswahl bestimmt)
  const currentPlayer = players.find((p) => p.id === playerId) || players[0];

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Spielerdaten...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Spieler-Avatar */}
              <div
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: currentPlayer.color }}
              >
                {currentPlayer.name.charAt(0)}
              </div>

              {/* Spieler-Info */}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {currentPlayer.name}
                </h1>
                <p className="text-blue-300">
                  Level {currentPlayer.level} | Position:{" "}
                  {currentPlayer.position.q},{currentPlayer.position.r}
                </p>
              </div>
            </div>

            {/* Zeit-Anzeige */}
            <div className="bg-gray-900 px-6 py-3 rounded-lg border border-blue-500/50">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{isNightTime() ? "🌙" : "☀️"}</div>
                <div>
                  <div className="text-xs text-gray-400">Spielwelt-Zeit</div>
                  <div className="text-xl font-bold text-white">
                    {getFormattedTime()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HP & Stamina Bars */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* HP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Gesundheit
                </span>
                <span className="text-xs text-white">
                  {currentPlayer.hp}/{currentPlayer.maxHp}
                </span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-500 h-4 transition-all duration-300"
                  style={{
                    width: `${(currentPlayer.hp / currentPlayer.maxHp) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Stamina Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Ausdauer
                </span>
                <span className="text-xs text-white">
                  {currentPlayer.stamina}/{currentPlayer.maxStamina}
                </span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-500 h-4 transition-all duration-300"
                  style={{
                    width: `${
                      (currentPlayer.stamina / currentPlayer.maxStamina) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-240px)]">
          {/* Hex Grid - 3/4 der Breite */}
          <div className="lg:col-span-3 bg-gray-800 border-2 border-blue-500/50 rounded-xl overflow-hidden">
            <HexGrid isPlayerView={true} />
          </div>

          {/* Sidebar - 1/4 der Breite */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* EXP */}
            <div className="bg-gray-800 border-2 border-blue-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Erfahrung
              </h3>
              <div className="bg-gray-900 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 transition-all duration-500"
                  style={{
                    width: `${
                      (currentPlayer.exp / currentPlayer.expToNextLevel) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="text-sm text-gray-400 mt-2 text-center">
                {currentPlayer.exp} / {currentPlayer.expToNextLevel} EXP
              </div>
              {currentPlayer.availableSkillPoints > 0 && (
                <div className="mt-3 bg-yellow-500/20 border border-yellow-500 rounded-lg p-2 text-center">
                  <p className="text-yellow-300 text-sm font-semibold">
                    🌟 {currentPlayer.availableSkillPoints} Skill-Punkt
                    {currentPlayer.availableSkillPoints > 1 ? "e" : ""}{" "}
                    verfügbar!
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-gray-800 border-2 border-blue-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">
                SPECIAL Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentPlayer.special).map(([stat, value]) => (
                  <div
                    key={stat}
                    className="bg-gray-900 rounded p-2 border border-gray-700"
                  >
                    <div className="text-xs text-gray-400 uppercase font-semibold">
                      {stat.charAt(0)}
                    </div>
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ausrüstung */}
            <div className="bg-gray-800 border-2 border-blue-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Ausrüstung
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sword className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Waffe</span>
                  </div>
                  <div className="text-white font-semibold">
                    {currentPlayer.equipment.weapon?.name || "Keine"}
                  </div>
                  {currentPlayer.equipment.weapon && (
                    <div className="text-xs text-gray-400 mt-1">
                      Schaden: {currentPlayer.equipment.weapon.damage}
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Rüstung</span>
                  </div>
                  <div className="text-white font-semibold">
                    {currentPlayer.equipment.armor?.name || "Keine"}
                  </div>
                  {currentPlayer.equipment.armor && (
                    <div className="text-xs text-gray-400 mt-1">
                      Verteidigung: {currentPlayer.equipment.armor.defense}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inventar */}
            <div className="bg-gray-800 border-2 border-blue-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Inventar ({currentPlayer.inventory.length}/
                {currentPlayer.maxInventorySlots})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {currentPlayer.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded p-2 aspect-square flex flex-col items-center justify-center border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                    title={item.name}
                  >
                    <div className="text-2xl mb-1">📦</div>
                    <div className="text-xs text-white text-center truncate w-full">
                      {item.name}
                    </div>
                  </div>
                ))}
                {/* Leere Slots */}
                {Array.from({
                  length:
                    currentPlayer.maxInventorySlots -
                    currentPlayer.inventory.length,
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="bg-gray-900/50 rounded aspect-square border border-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-800 border-2 border-blue-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Zustand:</span>
                  <span className="text-white capitalize">
                    {currentPlayer.status === "idle"
                      ? "Bereit"
                      : currentPlayer.status === "exploring"
                      ? "Erkundet"
                      : currentPlayer.status === "fighting"
                      ? "Im Kampf"
                      : "Ruht"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tageszeit:</span>
                  <span className="text-white">
                    {isNightTime() ? "🌙 Nacht" : "☀️ Tag"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexagonPlayerView;
