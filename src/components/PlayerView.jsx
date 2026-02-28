import React, { useState, useEffect } from "react";

const PlayerView = () => {
  const [tooltips, setTooltips] = useState([]);
  const [currentTooltip, setCurrentTooltip] = useState("");
  const [fadeIn, setFadeIn] = useState(true);

  // Lade Tooltips beim Start
  useEffect(() => {
    const loadTooltips = async () => {
      try {
        const response = await fetch("/Tooltips/Tooltip_List.txt");
        const text = await response.text();

        // Parse die Tooltips - entferne Kategorie-Überschriften und leere Zeilen
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter(
            (line) =>
              line &&
              line !== "Ernstgemeint:" &&
              line !== "Witzig und Obviously:",
          );

        setTooltips(lines);

        // Setze initialen Tooltip
        if (lines.length > 0) {
          setCurrentTooltip(lines[Math.floor(Math.random() * lines.length)]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Tooltips:", error);
      }
    };

    loadTooltips();
  }, []);

  // Wechsle Tooltip alle 30 Sekunden
  useEffect(() => {
    if (tooltips.length === 0) return;

    const interval = setInterval(() => {
      // Fade out
      setFadeIn(false);

      // Nach 500ms neuen Tooltip setzen und fade in
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tooltips.length);
        setCurrentTooltip(tooltips[randomIndex]);
        setFadeIn(true);
      }, 500);
    }, 30000); // 30 Sekunden

    return () => clearInterval(interval);
  }, [tooltips]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1
          className="text-gray-100 text-4xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          PlayerView
        </h1>
        <p className="text-purple-400 text-xl mb-8">
          Der Dungeon Master hat derzeit nichts was er euch zeigen möchte
        </p>

        {/* Tooltip Bereich */}
        {currentTooltip && (
          <div className="mt-12 pt-8 border-t border-purple-700/30">
            <div
              className="transition-opacity duration-500 ease-in-out"
              style={{ opacity: fadeIn ? 1 : 0 }}
            >
              <p className="text-purple-300/80 text-lg mb-3">
                <span className="font-semibold text-purple-200">Tooltip:</span>
              </p>
              <p className="text-gray-300 text-base italic max-w-2xl mx-auto leading-relaxed">
                {currentTooltip}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerView;
