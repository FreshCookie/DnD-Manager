import React, { useState, useEffect } from "react";

const PlayerView = () => {
  const [displayData, setDisplayData] = useState(null);
  const [theme] = useState({
    bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900",
    text: "text-gray-100",
    accent: "text-purple-400",
  });

  useEffect(() => {
    const broadcast = new BroadcastChannel("dnd-session");

    broadcast.onmessage = (event) => {
      setDisplayData(event.data);
    };

    return () => {
      broadcast.close();
    };
  }, []);

  if (!displayData) {
    return (
      <div
        className={`min-h-screen ${theme.bg} flex items-center justify-center p-8`}
      >
        <div className="text-center">
          <div
            className={`${theme.text} text-3xl font-bold mb-4`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            D&D Session Manager
          </div>
          <p className={`${theme.accent} text-xl`}>Warte auf GM Input...</p>
        </div>
      </div>
    );
  }

  const { type, data } = displayData;

  return (
    <div
      className={`min-h-screen ${theme.bg} flex items-center justify-center p-8`}
    >
      <div className="max-w-6xl w-full">
        {type === "npc" && (
          <div className="text-center">
            <h1
              className={`${theme.text} text-5xl font-bold mb-4`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {data.name}
            </h1>
            <p className={`${theme.accent} text-2xl mb-8`}>{data.profession}</p>
            {data.image && (
              <img
                src={data.image}
                alt={data.name}
                className="max-w-lg mx-auto rounded-xl shadow-2xl"
                style={{ maxHeight: "70vh", objectFit: "contain" }}
              />
            )}
          </div>
        )}

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
                className="w-full rounded-xl shadow-2xl"
                style={{ maxHeight: "70vh", objectFit: "cover" }}
              />
            )}
          </div>
        )}

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
                className="max-w-md mx-auto rounded-xl shadow-2xl mb-6"
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
