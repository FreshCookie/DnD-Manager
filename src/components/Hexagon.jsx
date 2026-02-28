import React from "react";
import { hexToPixel, createHexagonPath, HEX_SIZE } from "../utils/hexHelpers";

const Hexagon = ({
  q,
  r,
  visited,
  type,
  name,
  isSelected,
  isPlayerPosition,
  showFogOfWar,
  onClick,
  onHover,
  danger = 0,
  playersOnHex = [], // Array von Spielern auf diesem Hex
}) => {
  const { x, y } = hexToPixel(q, r);
  const hexPath = createHexagonPath();

  // Farben basierend auf Typ
  const getHexColor = () => {
    if (showFogOfWar && !visited) {
      return "#1a1a1a"; // Fog of War
    }

    switch (type) {
      case "forest":
        return "#2d5016";
      case "mountain":
        return "#4a4a4a";
      case "city":
        return "#8b6914";
      case "dungeon":
        return "#3d1a1a";
      case "water":
        return "#1a4d5c";
      case "desert":
        return "#d4a574";
      default:
        return "#2a2a2a";
    }
  };

  const getStrokeColor = () => {
    if (isPlayerPosition) return "#fbbf24"; // Gold für Spieler-Position
    if (isSelected) return "#8b5cf6"; // Lila für Auswahl
    if (visited) return "#4b5563"; // Grau für besucht
    return "#374151"; // Dunkelgrau Standard
  };

  const getDangerOverlay = () => {
    if (!visited || danger === 0) return null;
    const opacity = danger * 0.15;
    return <polygon points={hexPath} fill="#ef4444" opacity={opacity} />;
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={() => onClick && onClick(q, r)}
      onMouseEnter={() => onHover && onHover(q, r)}
      className="cursor-pointer"
    >
      {/* Haupthexagon */}
      <polygon
        points={hexPath}
        fill={getHexColor()}
        stroke={getStrokeColor()}
        strokeWidth={isSelected || isPlayerPosition ? "3" : "1.5"}
        className="transition-all duration-150 hover:opacity-80"
      />

      {/* Gefahren-Overlay */}
      {getDangerOverlay()}

      {/* Fog of War Overlay */}
      {showFogOfWar && !visited && (
        <>
          <polygon points={hexPath} fill="#000000" opacity="0.7" />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#666"
            fontSize="24"
            className="pointer-events-none select-none"
          >
            ?
          </text>
        </>
      )}

      {/* Koordinaten (nur GM View und besucht) */}
      {!showFogOfWar && (
        <text
          x="0"
          y="-15"
          textAnchor="middle"
          fill="#666"
          fontSize="8"
          className="pointer-events-none select-none"
        >
          {q},{r}
        </text>
      )}

      {/* Name (falls vorhanden und besucht) */}
      {visited && name && (
        <text
          x="0"
          y="5"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="10"
          className="pointer-events-none select-none font-semibold"
        >
          {name}
        </text>
      )}

      {/* Spieler-Marker */}
      {playersOnHex.length > 0 && (
        <>
          {playersOnHex.map((player, index) => {
            const angle = (index / playersOnHex.length) * Math.PI * 2;
            const radius = playersOnHex.length > 1 ? 12 : 0;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            return (
              <g key={player.id}>
                {/* Spieler-Kreis */}
                <circle
                  cx={px}
                  cy={py}
                  r="8"
                  fill={player.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                {/* Spieler-Initialen */}
                <text
                  x={px}
                  y={py + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {player.name.charAt(0)}
                </text>
              </g>
            );
          })}
        </>
      )}

      {/* Typ-Icon Indikator */}
      {visited && type !== "empty" && playersOnHex.length === 0 && (
        <circle
          cx="0"
          cy="0"
          r="4"
          fill={getHexColor()}
          stroke="#fff"
          strokeWidth="1"
        />
      )}
    </g>
  );
};

export default Hexagon;
