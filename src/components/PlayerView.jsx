import React, { useState, useEffect } from "react";

const PlayerView = () => {
  const [displayData, setDisplayData] = useState(null);
  const [tooltips, setTooltips] = useState([]);
  const [currentTooltip, setCurrentTooltip] = useState("");
  const [fadeIn, setFadeIn] = useState(true);
  const [theme] = useState({
    bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900",
    text: "text-gray-100",
    accent: "text-purple-400",
  });

  // BroadcastChannel für Kommunikation mit GM
  const [broadcast] = useState(() => new BroadcastChannel("dnd-session"));

  // Empfange Daten vom GM
  useEffect(() => {
    broadcast.onmessage = (event) => {
      console.log("PlayerView received:", event.data);
      setDisplayData(event.data);
    };

    return () => {
      broadcast.close();
    };
  }, [broadcast]);

  // Lade Tooltips beim Start
  useEffect(() => {
    const loadTooltips = async () => {
      try {
        const response = await fetch("/Tooltips/Tooltip_List.txt");
        const text = await response.text();

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
      setFadeIn(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tooltips.length);
        setCurrentTooltip(tooltips[randomIndex]);
        setFadeIn(true);
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, [tooltips]);

  // Sende Fehler zurück an GM
  const handleImageError = (imageSrc, itemName) => {
    console.error("Bild konnte nicht geladen werden:", imageSrc);
    broadcast.postMessage({
      type: "error",
      error: "image_load_failed",
      image: imageSrc,
      item: itemName,
    });
  };

  // Hierarchische Breadcrumb-Anzeige
  const renderLocationBreadcrumb = () => {
    if (!displayData || displayData.type === "clear") return null;

    const { type, parentLocation, parentSubLocation, location } = displayData;
    const actualParentLocation =
      parentLocation || (type === "both" ? location : null);
    const actualParentSubLocation = parentSubLocation;

    if (!actualParentLocation && !actualParentSubLocation) return null;

    return (
      <div className="absolute top-8 left-8 flex flex-col gap-4 z-50">
        {/* Parent Location */}
        {actualParentLocation && (
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-500/30">
            {actualParentLocation.images && actualParentLocation.images[0] && (
              <img
                src={actualParentLocation.images[0]}
                alt={actualParentLocation.name}
                loading="lazy"
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(
                    actualParentLocation.images[0],
                    actualParentLocation.name,
                  );
                }}
              />
            )}
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wide">
                Location
              </div>
              <div className={`${theme.text} text-sm font-semibold`}>
                {actualParentLocation.name}
              </div>
            </div>
          </div>
        )}

        {/* Parent SubLocation */}
        {actualParentSubLocation && (
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-400/40 ml-4">
            {actualParentSubLocation.image && (
              <img
                src={actualParentSubLocation.image}
                alt={actualParentSubLocation.name}
                loading="lazy"
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(
                    actualParentSubLocation.image,
                    actualParentSubLocation.name,
                  );
                }}
              />
            )}
            <div>
              <div className="text-sm text-purple-300 uppercase tracking-wide">
                Ort
              </div>
              <div className={`${theme.text} text-lg font-bold`}>
                {actualParentSubLocation.name}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Warte-Screen mit Tooltips
  if (!displayData || displayData.type === "clear") {
    return (
      <div
        className={`min-h-screen ${theme.bg} flex items-center justify-center p-8`}
      >
        <div className="text-center max-w-4xl">
          <h1
            className={`${theme.text} text-4xl font-bold mb-4`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            PlayerView
          </h1>
          <p className={`${theme.accent} text-xl mb-8`}>
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
                  <span className="font-semibold text-purple-200">
                    Tooltip:
                  </span>
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
  }

  const { type, data, npc, location } = displayData;

  return (
    <div
      className={`min-h-screen ${theme.bg} flex items-center justify-center p-8 relative`}
    >
      {renderLocationBreadcrumb()}

      <div className="max-w-6xl w-full">
        {/* NPC Ansicht */}
        {(type === "npc" || type === "both") && (
          <div className="text-center">
            <h1
              className={`${theme.text} text-5xl font-bold mb-4`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {type === "both" ? npc.name : data.name}
            </h1>
            <p className={`${theme.accent} text-2xl mb-8`}>
              {type === "both" ? npc.profession : data.profession}
            </p>
            {((type === "both" && npc.images?.[0]) ||
              (type === "npc" && data.image)) && (
              <img
                src={type === "both" ? npc.images[0] : data.image}
                alt={type === "both" ? npc.name : data.name}
                loading="lazy"
                className="max-w-lg mx-auto rounded-xl shadow-2xl"
                style={{ maxHeight: "70vh", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(
                    type === "both" ? npc.images[0] : data.image,
                    type === "both" ? npc.name : data.name,
                  );
                }}
              />
            )}
          </div>
        )}

        {/* Location Ansicht */}
        {type === "location" && (
          <div className="text-center">
            <h1
              className={`${theme.text} text-5xl font-bold mb-8`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {data.name}
            </h1>
            {data.image && (
              <img
                src={data.image}
                alt={data.name}
                loading="lazy"
                className="w-full rounded-xl shadow-2xl"
                style={{ maxHeight: "70vh", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(data.image, data.name);
                }}
              />
            )}
          </div>
        )}

        {/* SubLocation Ansicht */}
        {type === "subLocation" && (
          <div className="text-center">
            <h1
              className={`${theme.text} text-5xl font-bold mb-8`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {data.name}
            </h1>
            {data.image && (
              <img
                src={data.image}
                alt={data.name}
                loading="lazy"
                className="max-w-4xl mx-auto rounded-xl shadow-2xl"
                style={{ maxHeight: "60vh", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(data.image, data.name);
                }}
              />
            )}
          </div>
        )}

        {/* Item Ansicht */}
        {type === "item" && (
          <div className="text-center">
            <h1
              className={`${theme.text} text-5xl font-bold mb-8`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {data.name}
            </h1>
            {data.image && (
              <img
                src={data.image}
                alt={data.name}
                loading="lazy"
                className="max-w-md mx-auto rounded-xl shadow-2xl mb-6"
                onError={(e) => {
                  e.target.style.display = "none";
                  handleImageError(data.image, data.name);
                }}
              />
            )}
            {data.description && (
              <p className={`${theme.text} text-xl mb-6 max-w-2xl mx-auto`}>
                {data.description}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {data.positiveStats && (
                <div className="bg-green-900/30 border-2 border-green-500/50 rounded-lg p-4">
                  <div className="text-green-400 text-2xl font-bold mb-2">
                    ✓ Vorteile
                  </div>
                  <p className={theme.text}>{data.positiveStats}</p>
                </div>
              )}
              {data.negativeStats && (
                <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-4">
                  <div className="text-red-400 text-2xl font-bold mb-2">
                    ✗ Nachteile
                  </div>
                  <p className={theme.text}>{data.negativeStats}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerView;
