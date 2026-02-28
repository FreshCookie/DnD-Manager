import React, { createContext, useContext, useState, useCallback } from "react";
import { createPlayer } from "../utils/playerHelpers";

const HexagonContext = createContext();

export const useHexagon = () => {
  const context = useContext(HexagonContext);
  if (!context) {
    throw new Error("useHexagon must be used within HexagonProvider");
  }
  return context;
};

export const HexagonProvider = ({ children }) => {
  // Hex-Grid Daten - jedes Hex hat axiale Koordinaten (q, r)
  const [hexagons, setHexagons] = useState(() => generateInitialHexGrid(12));

  // Spielwelt-Zeit (in Minuten seit Spielstart, z.B. 480 = 8:00 Uhr)
  const [gameTime, setGameTime] = useState(480); // Start: 8:00 Uhr

  // Aktuell ausgewähltes Hex
  const [selectedHex, setSelectedHex] = useState(null);

  // Spieler-Position
  const [playerPosition, setPlayerPosition] = useState({ q: 0, r: 0 });

  // Spieler-Liste
  const [players, setPlayers] = useState([
    createPlayer("Spieler 1", "#3b82f6"),
    createPlayer("Spieler 2", "#ef4444"),
    createPlayer("Spieler 3", "#10b981"),
    createPlayer("Spieler 4", "#f59e0b"),
  ]);

  // Hex als besucht markieren
  const visitHex = useCallback((q, r, travelTime = 30) => {
    setHexagons((prev) =>
      prev.map((hex) =>
        hex.q === q && hex.r === r ? { ...hex, visited: true } : hex
      )
    );
    setPlayerPosition({ q, r });
    // Zeit voranschreiten lassen
    setGameTime((prev) => prev + travelTime);
  }, []);

  // Hex-Daten aktualisieren
  const updateHex = useCallback((q, r, updates) => {
    setHexagons((prev) =>
      prev.map((hex) =>
        hex.q === q && hex.r === r ? { ...hex, ...updates } : hex
      )
    );
  }, []);

  // Zeit manuell setzen
  const setTime = useCallback((minutes) => {
    setGameTime(minutes);
  }, []);

  // Zeit vorspulen
  const advanceTime = useCallback((minutes) => {
    setGameTime((prev) => prev + minutes);
  }, []);

  // Formatierte Zeit (HH:MM)
  const getFormattedTime = useCallback(() => {
    const hours = Math.floor(gameTime / 60) % 24;
    const minutes = gameTime % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }, [gameTime]);

  // Ist es Nacht? (20:00 - 6:00)
  const isNightTime = useCallback(() => {
    const hours = Math.floor(gameTime / 60) % 24;
    return hours >= 20 || hours < 6;
  }, [gameTime]);

  const value = {
    hexagons,
    setHexagons,
    gameTime,
    setGameTime,
    selectedHex,
    setSelectedHex,
    playerPosition,
    setPlayerPosition,
    players,
    setPlayers,
    visitHex,
    updateHex,
    setTime,
    advanceTime,
    getFormattedTime,
    isNightTime,
  };

  return (
    <HexagonContext.Provider value={value}>{children}</HexagonContext.Provider>
  );
};

// Initiales Hex-Grid generieren (Radius 12 = 397 Hexagons)
function generateInitialHexGrid(radius = 12) {
  const hexagons = [];

  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);

    for (let r = r1; r <= r2; r++) {
      hexagons.push({
        q,
        r,
        visited: q === 0 && r === 0, // Nur Startpunkt ist besucht
        type: "empty", // empty, forest, mountain, city, dungeon, etc.
        name: "",
        description: "",
        events: [],
        danger: 0, // 0-5 Gefahrenstufe
        explorationLevel: 0, // 0-5 Erkundungslevel
      });
    }
  }

  return hexagons;
}
