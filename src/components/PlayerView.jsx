import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { LogOut } from "lucide-react";

const PlayerView = ({ character = null, players = [], onLogout = null }) => {
  const [displayData, setDisplayData] = useState(null);
  const [tooltips, setTooltips] = useState([]);
  const [currentTooltip, setCurrentTooltip] = useState("");
  const [fadeIn, setFadeIn] = useState(true);
  const [socket, setSocket] = useState(null);
  const [theme] = useState({
    bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900",
    text: "text-gray-100",
    accent: "text-purple-400",
  });

  // Finde Character-Daten wenn character-ID übergeben wurde
  const characterData = character
    ? players.find((p) => p.id === character)
    : null;

  // Debug Logging
  useEffect(() => {
    console.log("🎭 PlayerView Character Debug:", {
      character,
      playersCount: players.length,
      characterData,
      players: players.map((p) => ({ id: p.id, name: p.name })),
    });
  }, [character, players, characterData]);

  // Socket.io Connection
  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "";
    const socketUrl = API_BASE_URL || window.location.origin;
    
    console.log("🎯 PlayerView: Connecting to Socket.io at", socketUrl);
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("🎯 PlayerView: Socket.io connected!", newSocket.id);
    });

    newSocket.on("player:playerview-update", (data) => {
      console.log("🎯 PlayerView received via Socket.io:", data);
      setDisplayData(data);
    });

    newSocket.on("disconnect", () => {
      console.log("🎯 PlayerView: Socket.io disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("🎯 PlayerView: Socket.io connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      console.log("🎯 PlayerView: Closing Socket.io connection");
      newSocket.close();
    };
  }, []);

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

  // Sende Fehler zurück an GM via Socket.io
  const handleImageError = (imageSrc, itemName) => {
    console.error("Bild konnte nicht geladen werden:", imageSrc);
    if (socket && socket.connected) {
      socket.emit("player:image-error", {
        type: "error",
        error: "image_load_failed",
        image: imageSrc,
        item: itemName,
      });
    }
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
        className={`min-h-screen ${theme.bg} flex items-center justify-center p-8 relative`}
      >
        {/* Logout Button auch im Warte-Screen */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300 hover:text-red-100 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        )}

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
      {/* Logout Button (nur wenn onLogout prop vorhanden) */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300 hover:text-red-100 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Logout</span>
        </button>
      )}

      {/* Character Info (nur für eingeloggte Spieler) */}
      {characterData && (
        <div className="absolute top-4 right-4 z-50 bg-gray-800/90 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl p-3 flex items-center gap-3 shadow-xl">
          {characterData.image && (
            <img
              src={characterData.image}
              alt={characterData.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div>
            <div className="text-white font-bold text-sm">
              {characterData.name}
            </div>
            {characterData.class && (
              <div className="text-purple-300 text-xs">
                {characterData.class}
              </div>
            )}
          </div>
        </div>
      )}

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

        {/* K&C Referenz Ansicht */}
        {type === "kinksReference" && (
          <div className="max-w-5xl mx-auto">
            {/* Header mit Kategorie */}
            <div className="text-center mb-8">
              <h1
                className={`${theme.accent} text-4xl font-bold mb-2 uppercase tracking-wide`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {displayData.category === "kinks" && "🔗 Kink"}
                {displayData.category === "classes" && "⚔️ Klasse"}
                {displayData.category === "races" && "🧝 Rasse"}
                {displayData.category === "creatures" && "🐉 Kreatur"}
                {displayData.category === "mechanics" && "⚙️ Mechanik"}
              </h1>
              <h2
                className={`${theme.text} text-6xl font-bold`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {data.name}
              </h2>
            </div>

            {/* Content basierend auf Kategorie */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30">
              {/* Kink Anzeige */}
              {displayData.category === "kinks" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-purple-500/30">
                    <span className="inline-block bg-purple-900/50 text-purple-300 px-4 py-2 rounded-lg text-lg font-semibold">
                      {data.category}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${theme.text} text-2xl leading-relaxed text-center`}
                    >
                      {data.shortDescription}
                    </p>
                  </div>

                  {data.mechanicsSummary && (
                    <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-xl p-6">
                      <div className="text-purple-300 text-xl font-bold mb-3 flex items-center gap-2">
                        🎲 Spielmechanik
                      </div>
                      <p className={`${theme.text} text-lg leading-relaxed`}>
                        {data.mechanicsSummary}
                      </p>
                    </div>
                  )}

                  {data.examples && (
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className={`${theme.accent} text-xl font-bold mb-3`}>
                        Beispiele
                      </div>
                      <p className={`${theme.text} text-lg`}>{data.examples}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Klassen Anzeige */}
              {displayData.category === "classes" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-blue-500/30">
                    <span className="inline-block bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg text-lg font-semibold">
                      {data.baseClass}
                    </span>
                    <span className="inline-block bg-gray-800/50 text-gray-300 px-4 py-2 rounded-lg text-lg">
                      {data.source}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${theme.text} text-2xl leading-relaxed text-center`}
                    >
                      {data.shortDescription}
                    </p>
                  </div>

                  <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-xl p-6">
                    <div className="text-blue-300 text-xl font-bold mb-3 flex items-center gap-2">
                      ⭐ Hauptmerkmale
                    </div>
                    <p className={`${theme.text} text-lg leading-relaxed`}>
                      {data.keyFeatures}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <div className={`${theme.accent} text-xl font-bold mb-3`}>
                      Spielstil
                    </div>
                    <p className={`${theme.text} text-lg`}>{data.playstyle}</p>
                  </div>
                </div>
              )}

              {/* Rassen Anzeige */}
              {displayData.category === "races" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-green-500/30">
                    <span className="inline-block bg-green-900/50 text-green-300 px-4 py-2 rounded-lg text-lg font-semibold">
                      {data.type}
                    </span>
                    <span className="inline-block bg-gray-800/50 text-gray-300 px-4 py-2 rounded-lg text-lg">
                      {data.source}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${theme.text} text-2xl leading-relaxed text-center`}
                    >
                      {data.shortDescription}
                    </p>
                  </div>

                  <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-6">
                    <div className="text-green-300 text-xl font-bold mb-3 flex items-center gap-2">
                      🎯 Rasseneigenschaften
                    </div>
                    <p className={`${theme.text} text-lg leading-relaxed`}>
                      {data.traits}
                    </p>
                  </div>

                  {data.culturalNotes && (
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className={`${theme.accent} text-xl font-bold mb-3`}>
                        Kulturelle Hintergründe
                      </div>
                      <p className={`${theme.text} text-lg`}>
                        {data.culturalNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Kreaturen Anzeige */}
              {displayData.category === "creatures" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-red-500/30">
                    <span className="inline-block bg-red-900/50 text-red-300 px-4 py-2 rounded-lg text-lg font-semibold">
                      {data.type}
                    </span>
                    <span className="inline-block bg-orange-900/50 text-orange-300 px-4 py-2 rounded-lg text-lg font-bold">
                      CR {data.cr}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${theme.text} text-2xl leading-relaxed text-center`}
                    >
                      {data.shortDescription}
                    </p>
                  </div>

                  <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6">
                    <div className="text-red-300 text-xl font-bold mb-3 flex items-center gap-2">
                      ⚔️ Kampftaktik
                    </div>
                    <p className={`${theme.text} text-lg leading-relaxed`}>
                      {data.tactics}
                    </p>
                  </div>

                  {data.loot && (
                    <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-xl p-6">
                      <div className="text-yellow-300 text-xl font-bold mb-3">
                        💎 Beute
                      </div>
                      <p className={`${theme.text} text-lg`}>{data.loot}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mechaniken Anzeige */}
              {displayData.category === "mechanics" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-yellow-500/30">
                    <span className="inline-block bg-yellow-900/50 text-yellow-300 px-4 py-2 rounded-lg text-lg font-semibold">
                      {data.category}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${theme.text} text-2xl leading-relaxed text-center`}
                    >
                      {data.shortDescription}
                    </p>
                  </div>

                  <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-xl p-6">
                    <div className="text-yellow-300 text-xl font-bold mb-3 flex items-center gap-2">
                      📖 Details
                    </div>
                    <p className={`${theme.text} text-lg leading-relaxed`}>
                      {data.details}
                    </p>
                  </div>

                  {data.rules && (
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className={`${theme.accent} text-xl font-bold mb-3`}>
                        Regelwerk
                      </div>
                      <p className={`${theme.text} text-lg`}>{data.rules}</p>
                    </div>
                  )}
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
