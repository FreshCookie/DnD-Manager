import React, { useState } from "react";
import { useHexagon } from "../contexts/HexagonContext";
import HexGrid from "./HexGrid";
import PlayerManagement from "./PlayerManagement";
import ExplorationPanel from "./ExplorationPanel";
import MovementPanel from "./MovementPanel";
import ItemDatabase from "./ItemDatabase";
import {
  Clock,
  Moon,
  Sun,
  MapPin,
  Users,
  ExternalLink,
  Package,
} from "lucide-react";

const HexagonGMView = () => {
  const {
    selectedHex,
    updateHex,
    visitHex,
    gameTime,
    getFormattedTime,
    isNightTime,
    advanceTime,
  } = useHexagon();

  const [activeTab, setActiveTab] = useState("hex"); // "hex", "players", oder "items"
  const [showExplorationPanel, setShowExplorationPanel] = useState(false);
  const [showMovementPanel, setShowMovementPanel] = useState(false);

  const handleVisitHex = () => {
    if (selectedHex) {
      visitHex(selectedHex.q, selectedHex.r, 30);
    }
  };

  const handleUpdateHexType = (type) => {
    if (selectedHex) {
      updateHex(selectedHex.q, selectedHex.r, { type });
    }
  };

  const handleUpdateHexName = (name) => {
    if (selectedHex) {
      updateHex(selectedHex.q, selectedHex.r, { name });
    }
  };

  const handleUpdateDanger = (danger) => {
    if (selectedHex) {
      updateHex(selectedHex.q, selectedHex.r, { danger: parseInt(danger) });
    }
  };

  const openPlayerView = () => {
    // Öffne ein neues Fenster mit der Player View
    const url = window.location.origin + "/hexagon-player.html";
    window.open(url, "HexagonPlayerView", "width=1920,height=1080");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="bg-gray-800 border-2 border-purple-500 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                {/* Player View Button */}
                <button
                  onClick={openPlayerView}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold"
                >
                  <ExternalLink className="w-5 h-5" /> Player View öffnen
                </button>

                <h1 className="text-3xl font-bold text-white mb-1">
                  Hexagon Story - Game Master
                </h1>
                <p className="text-purple-300">Weltenkarte & Management</p>
              </div>

              {/* Zeit-Anzeige */}

              <div className="bg-gray-900 px-6 py-3 rounded-lg border border-purple-500/50">
                <div className="flex items-center gap-3">
                  {isNightTime() ? (
                    <Moon className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-400" />
                  )}
                  <div>
                    <div className="text-xs text-gray-400">Spielwelt-Zeit</div>
                    <div className="text-2xl font-bold text-white">
                      {getFormattedTime()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Zeit-Kontrollen */}
              <div className="flex gap-2">
                <button
                  onClick={() => advanceTime(30)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  +30 Min
                </button>
                <button
                  onClick={() => advanceTime(60)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  +1 Std
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
          {/* Hex Grid - 3/4 der Breite */}
          <div className="lg:col-span-3 bg-gray-800 border-2 border-purple-500/50 rounded-xl overflow-hidden">
            <HexGrid isPlayerView={false} />
          </div>

          {/* Sidebar - 1/4 der Breite */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* Tab-Navigation */}
            <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("hex")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "hex"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Hex
              </button>
              <button
                onClick={() => setActiveTab("players")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "players"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Spieler
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "items"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Package className="w-4 h-4 inline mr-1" />
                Items
              </button>
            </div>

            {/* Hex Details Tab */}
            {activeTab === "hex" && selectedHex ? (
              <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Hex Details
                </h2>

                <div className="space-y-3">
                  {/* Koordinaten */}
                  <div>
                    <label className="text-xs text-gray-400">Koordinaten</label>
                    <div className="text-white font-mono">
                      Q: {selectedHex.q}, R: {selectedHex.r}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={selectedHex.name || ""}
                      onChange={(e) => handleUpdateHexName(e.target.value)}
                      className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="Hex benennen..."
                    />
                  </div>

                  {/* Typ */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Typ
                    </label>
                    <select
                      value={selectedHex.type}
                      onChange={(e) => handleUpdateHexType(e.target.value)}
                      className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="empty">Leer</option>
                      <option value="forest">Wald</option>
                      <option value="mountain">Gebirge</option>
                      <option value="city">Stadt</option>
                      <option value="dungeon">Dungeon</option>
                      <option value="water">Wasser</option>
                      <option value="desert">Wüste</option>
                    </select>
                  </div>

                  {/* Gefahrenstufe */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Gefahrenstufe: {selectedHex.danger}/5
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={selectedHex.danger}
                      onChange={(e) => handleUpdateDanger(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Besucht Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Besucht:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        selectedHex.visited
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {selectedHex.visited ? "Ja" : "Nein"}
                    </span>
                  </div>

                  {/* Als besucht markieren */}
                  {!selectedHex.visited && (
                    <button
                      onClick={handleVisitHex}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Als besucht markieren
                    </button>
                  )}

                  {/* Bewegung starten */}
                  <button
                    onClick={() => setShowMovementPanel(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    🚶 Spieler bewegen
                  </button>

                  {/* Erkundung starten */}
                  <button
                    onClick={() => setShowExplorationPanel(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    🔍 Erkundung starten
                  </button>
                </div>
              </div>
            ) : activeTab === "hex" ? (
              <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Wähle ein Hexagon auf der Karte aus
                </p>
              </div>
            ) : null}

            {/* Spieler Tab */}
            {activeTab === "players" && <PlayerManagement />}

            {/* Items Tab */}
            {activeTab === "items" && <ItemDatabase />}

            {/* Quick Stats */}
            <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">Statistiken</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Erkundete Hexe:</span>
                  <span className="text-white font-semibold">
                    {/* Berechnung der besuchten Hexe */}3 / 61
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Spielzeit:</span>
                  <span className="text-white font-semibold">
                    {Math.floor(gameTime / 60)}h {gameTime % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tageszeit:</span>
                  <span className="text-white font-semibold">
                    {isNightTime() ? "🌙 Nacht" : "☀️ Tag"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Erkundungs-Panel Modal */}
        {showExplorationPanel && selectedHex && (
          <ExplorationPanel
            hex={selectedHex}
            onClose={() => setShowExplorationPanel(false)}
          />
        )}

        {/* Bewegungs-Panel Modal */}
        {showMovementPanel && selectedHex && (
          <MovementPanel
            selectedHex={selectedHex}
            onClose={() => setShowMovementPanel(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HexagonGMView;
