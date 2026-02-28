import React from "react";
import { Eye, MapPin, Users, Package, Scroll, Timer, X } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { stopSound } from "./SoundManager";

const CurrentDisplayIndicator = ({ theme }) => {
  const {
    currentLocation,
    currentNPC,
    currentSubLocation,
    setCurrentLocation,
    setCurrentNPC,
    setCurrentSubLocation,
    sendToPlayerView,
  } = useData();
  const [lastType, setLastType] = React.useState(null);

  React.useEffect(() => {
    const broadcast = new BroadcastChannel("dnd-session");

    broadcast.onmessage = (event) => {
      const data = event.data;
      if (data.type) {
        setLastType(data.type);
      }
    };

    return () => {
      broadcast.close();
    };
  }, []);

  const handleClear = () => {
    setCurrentLocation(null);
    setCurrentNPC(null);
    setCurrentSubLocation(null);
    setLastType(null);
    stopSound();

    // Sende "clear" an Player View
    sendToPlayerView({
      type: "clear",
      data: null,
    });
  };

  // Spezielle Anzeigen
  if (lastType === "direktor") {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl w-full overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <Eye className={`${theme.accent} w-6 h-6`} />
            <h3
              className={`${theme.text} text-lg md:text-xl font-bold break-words`}
            >
              Player View Status
            </h3>
          </div>
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 text-sm md:text-base w-full md:w-auto justify-center"
          >
            <X className="w-5 h-5" /> Clear
          </button>
        </div>
        <div
          className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Scroll className={`${theme.accent} w-5 h-5`} />
            <span className={`${theme.text} font-semibold`}>
              D Rektor Intro
            </span>
          </div>
          <div className={`${theme.accent} text-sm`}>
            Story Einführung wird angezeigt
          </div>
        </div>
      </div>
    );
  }

  if (lastType === "challenge") {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl w-full overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <Eye className={`${theme.accent} w-6 h-6`} />
            <h3
              className={`${theme.text} text-lg md:text-xl font-bold break-words`}
            >
              Player View Status
            </h3>
          </div>
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 text-sm md:text-base w-full md:w-auto justify-center"
          >
            <X className="w-5 h-5" /> Clear
          </button>
        </div>
        <div
          className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Timer className={`${theme.accent} w-5 h-5`} />
            <span className={`${theme.text} font-semibold`}>
              Challenge Timer
            </span>
          </div>
          <div className={`${theme.accent} text-sm`}>Challenge läuft</div>
        </div>
      </div>
    );
  }

  if (lastType === "item") {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Eye className={`${theme.accent} w-6 h-6`} />
            <h3 className={`${theme.text} text-xl font-bold`}>
              Player View Status
            </h3>
          </div>
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
        <div
          className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className={`${theme.accent} w-5 h-5`} />
            <span className={`${theme.text} font-semibold`}>Item</span>
          </div>
          <div className={`${theme.accent} text-sm`}>Item wird angezeigt</div>
        </div>
      </div>
    );
  }

  if (!currentLocation && !currentNPC && !currentSubLocation) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl w-full overflow-hidden`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Eye className={`${theme.accent} w-6 h-6`} />
          <h3
            className={`${theme.text} text-lg md:text-xl font-bold break-words`}
          >
            Player View Status
          </h3>
        </div>
        <div
          className={`${theme.text} text-center py-6 opacity-50 text-sm md:text-sm`}
        >
          Momentan wird nichts angezeigt
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl w-full overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <Eye className={`${theme.accent} w-6 h-6`} />
          <h3
            className={`${theme.text} text-lg md:text-xl font-bold break-words`}
          >
            Player View Status
          </h3>
        </div>
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 text-sm md:text-base w-full md:w-auto justify-center"
        >
          <X className="w-5 h-5" /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {currentLocation && (
          <div
            className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className={`${theme.accent} w-5 h-5`} />
              <span className={`${theme.text} font-semibold`}>Location:</span>
            </div>
            <div className={`${theme.accent} text-lg`}>
              {currentLocation.name}
            </div>
            {currentLocation.images &&
              currentLocation.images.length > 0 &&
              currentLocation.images[0] && (
                <img
                  src={currentLocation.images[0]}
                  alt={currentLocation.name}
                  className="w-full h-24 object-cover rounded-lg mt-2"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
          </div>
        )}

        {currentSubLocation && (
          <div
            className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className={`${theme.accent} w-5 h-5`} />
              <span className={`${theme.text} font-semibold`}>
                SubLocation:
              </span>
            </div>
            <div className={`${theme.accent} text-lg`}>
              {currentSubLocation.name}
            </div>
            {currentSubLocation.image && (
              <img
                src={currentSubLocation.image}
                alt={currentSubLocation.name}
                className="w-full h-24 object-cover rounded-lg mt-2"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
        )}

        {currentNPC && (
          <div
            className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className={`${theme.accent} w-5 h-5`} />
              <span className={`${theme.text} font-semibold`}>NPC:</span>
            </div>
            <div className={`${theme.accent} text-lg`}>{currentNPC.name}</div>
            <div className={`${theme.text} text-sm opacity-70`}>
              {currentNPC.profession}
            </div>
            {currentNPC.images &&
              currentNPC.images.length > 0 &&
              currentNPC.images[0] && (
                <img
                  src={currentNPC.images[0]}
                  alt={currentNPC.name}
                  className="w-full h-24 object-cover rounded-lg mt-2"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentDisplayIndicator;
