import React, { useState, useEffect } from "react";
import { Users, LogOut, RefreshCw, User } from "lucide-react";

const OnlinePlayersManager = ({ theme, sessionId, onLogoutAll }) => {
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchOnlinePlayers = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_BASE_URL}/api/auth/online-players`, {
        headers: {
          "x-session-id": sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOnlinePlayers(data.onlinePlayers);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Fehler beim Laden der Online-Spieler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlinePlayers();

    // Auto-Refresh alle 10 Sekunden
    const interval = setInterval(fetchOnlinePlayers, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleLogoutAll = async () => {
    if (!confirm("Möchtest du wirklich alle Spieler ausloggen?")) {
      return;
    }

    const result = await onLogoutAll();
    if (result.success) {
      setOnlinePlayers([]);
      alert("Alle Spieler wurden ausgeloggt");
    } else {
      alert("Fehler beim Ausloggen: " + result.error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-2xl font-bold`}>Online Spieler</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOnlinePlayers}
            disabled={isLoading}
            className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
            title="Aktualisieren"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Player Count */}
      <div className="mb-4 flex items-center justify-between">
        <span className={`${theme.text} text-lg`}>
          <strong className={theme.accent}>{onlinePlayers.length}</strong>{" "}
          {onlinePlayers.length === 1 ? "Spieler" : "Spieler"} online
        </span>
        {lastUpdate && (
          <span className={`${theme.text} text-sm opacity-60`}>
            Zuletzt aktualisiert: {formatTime(lastUpdate)}
          </span>
        )}
      </div>

      {/* Players List */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {onlinePlayers.length > 0 ? (
          onlinePlayers.map((player) => (
            <div
              key={player.sessionId}
              className={`${theme.cardBg} border ${theme.border} rounded-lg p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                  <div>
                    <div className="flex items-center gap-2">
                      <User className={`${theme.accent} w-4 h-4`} />
                      <span className={`${theme.text} font-bold`}>
                        {player.username}
                      </span>
                    </div>
                    {player.character && (
                      <span className={`${theme.text} text-sm opacity-70`}>
                        Spielt: {player.character}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${theme.text} text-xs opacity-60`}>
                    Login: {formatTime(player.loginTime)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`${theme.text} opacity-50 text-center py-8 border-2 border-dashed ${theme.border} rounded-lg`}
          >
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Keine Spieler online</p>
            <p className="text-sm mt-1">
              Spieler können sich über den Login einloggen
            </p>
          </div>
        )}
      </div>

      {/* Logout All Button */}
      {onlinePlayers.length > 0 && (
        <button
          onClick={handleLogoutAll}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Alle Spieler ausloggen
        </button>
      )}
    </div>
  );
};

export default OnlinePlayersManager;
