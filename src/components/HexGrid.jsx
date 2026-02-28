import React, { useState, useRef, useEffect } from "react";
import Hexagon from "./Hexagon";
import { useHexagon } from "../contexts/HexagonContext";

const HexGrid = ({ isPlayerView = false }) => {
  const { hexagons, selectedHex, setSelectedHex, playerPosition, players } =
    useHexagon();

  const [viewBox, setViewBox] = useState({
    x: -600,
    y: -400,
    width: 2400,
    height: 1600,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  // Hex anklicken
  const handleHexClick = (q, r) => {
    const hex = hexagons.find((h) => h.q === q && h.r === r);
    if (!hex) return;

    if (isPlayerView) {
      // Im Player View kann nur geklickt werden wenn visited
      if (hex.visited) {
        setSelectedHex(hex);
      }
    } else {
      // Im GM View alles anklickbar
      setSelectedHex(hex);
    }
  };

  // Pan & Zoom Funktionalität
  const handleMouseDown = (e) => {
    if (e.button === 1 || e.shiftKey || e.button === 0) {
      // Mittlere Maustaste, Shift+Click oder normale linke Maustaste für Panning
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;

      // Skalierungsfaktor basierend auf aktuellem Zoom
      const scale = viewBox.width / 2400;

      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx * scale,
        y: prev.y - dy * scale,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();

    // Maus-Position im SVG berechnen
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Mouse-Position in ViewBox-Koordinaten umrechnen
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;

    // Zoom-Faktor
    const scaleFactor = e.deltaY > 0 ? 1.15 : 0.87;
    const newWidth = viewBox.width * scaleFactor;
    const newHeight = viewBox.height * scaleFactor;

    // Neue ViewBox-Position berechnen (zoom to mouse position)
    const newX = svgX - (mouseX / rect.width) * newWidth;
    const newY = svgY - (mouseY / rect.height) * newHeight;

    setViewBox({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  // Zentrierung auf Spieler-Position
  const centerOnPlayer = () => {
    const { x, y } = hexToPixel(playerPosition.q, playerPosition.r);
    setViewBox({
      x: x - 1200,
      y: y - 800,
      width: 2400,
      height: 1600,
    });
  };

  useEffect(() => {
    // Bei Spieler-View automatisch auf Spieler zentrieren
    if (isPlayerView) {
      centerOnPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerView, playerPosition]);

  return (
    <div className="relative w-full h-full bg-gray-950 rounded-lg overflow-hidden">
      {/* Kontroll-Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={centerOnPlayer}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          📍 Zentrieren
        </button>
        <button
          onClick={() =>
            setViewBox({ x: -600, y: -400, width: 2400, height: 1600 })
          }
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          🔄 Reset Zoom
        </button>
      </div>

      {/* SVG Hex Grid */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={isPanning ? "cursor-grabbing" : "cursor-grab"}
        style={{ userSelect: "none", touchAction: "none" }}
      >
        {/* Grid-Hintergrund */}
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="#030712"
        />

        {/* Hexagons */}
        {hexagons.map((hex) => {
          // Spieler auf diesem Hex finden
          const playersOnHex = players.filter(
            (p) => p.position.q === hex.q && p.position.r === hex.r
          );

          return (
            <Hexagon
              key={`${hex.q},${hex.r}`}
              q={hex.q}
              r={hex.r}
              visited={hex.visited}
              type={hex.type}
              name={hex.name}
              danger={hex.danger}
              isSelected={selectedHex?.q === hex.q && selectedHex?.r === hex.r}
              isPlayerPosition={
                playerPosition.q === hex.q && playerPosition.r === hex.r
              }
              showFogOfWar={isPlayerView}
              onClick={handleHexClick}
              playersOnHex={playersOnHex}
            />
          );
        })}
      </svg>

      {/* Info: Steuerung */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 px-4 py-2 rounded-lg text-xs text-gray-300">
        <p>🖱️ Drag zum Verschieben | Scroll zum Zoomen (auf Mausposition)</p>
      </div>
    </div>
  );
};

// Helper-Funktion aus Hexagon.jsx
const hexToPixel = (q, r, size = 30) => {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * ((3 / 2) * r);
  return { x, y };
};

export default HexGrid;
