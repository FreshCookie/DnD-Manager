// Konstanten für Hexagone
export const HEX_SIZE = 30;

// Konvertiere Axial-Koordinaten (q,r) zu Pixel-Koordinaten (flat-top orientation)
export const hexToPixel = (q, r, size = HEX_SIZE) => {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * ((3 / 2) * r);
  return { x, y };
};

// Erstelle SVG-Pfad für flaches Hexagon (flat-top)
export const createHexagonPath = (size = HEX_SIZE) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30; // -30 für flat-top Orientierung
    const angleRad = (Math.PI / 180) * angleDeg;
    const x = size * Math.cos(angleRad);
    const y = size * Math.sin(angleRad);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
};
