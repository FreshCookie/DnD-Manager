import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { DataProvider18Plus } from "./contexts/DataContext18Plus";
import { HexagonProvider } from "./contexts/HexagonContext";
import LoginScreen from "./components/LoginScreen";
import CharacterSelector from "./components/CharacterSelector";
import PlayerView from "./components/PlayerView";
import StartScreen from "./components/StartScreen";
import PenAndPaperMode from "./components/PenAndPaperMode";
import PenAndPaperMode18Plus from "./components/PenAndPaperMode18Plus";
import HexagonGMView from "./components/HexagonGMView";

// Hauptlogik nach Auth-Check
function AuthenticatedApp() {
  const {
    isAuthenticated,
    isLoading,
    user,
    character,
    login,
    register,
    joinSession,
    logout,
  } = useAuth();
  const [selectedMode, setSelectedMode] = useState(null);
  const [availableCharacters, setAvailableCharacters] = useState([]);

  // Lade verfügbare Charaktere für Login/Register
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${API_BASE_URL}/api/data`);
        const data = await response.json();
        setAvailableCharacters(data.players || []);
      } catch (error) {
        console.error("Fehler beim Laden der Charaktere:", error);
      }
    };
    loadCharacters();
  }, []);

  // ESC-Taste zum Zurückkehren (nur für GM)
  useEffect(() => {
    if (user?.role !== "gm") return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedMode(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [user]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade Session Manager...</div>
      </div>
    );
  }

  // Nicht eingeloggt → LoginScreen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={login}
        onRegister={register}
        availableCharacters={availableCharacters}
      />
    );
  }

  // Spieler eingeloggt
  if (user.role === "player") {
    // Noch kein Charakter gewählt → CharacterSelector
    if (!character) {
      const playerChars = availableCharacters.filter((char) =>
        user.characters?.includes(char.id),
      );

      return (
        <CharacterSelector
          characters={playerChars}
          onSelectCharacter={joinSession}
        />
      );
    }

    // Charakter gewählt → PlayerView
    return (
      <PlayerView
        character={character}
        players={availableCharacters}
        onLogout={logout}
      />
    );
  }

  // GM eingeloggt → StartScreen → Modi
  if (user.role === "gm") {
    // Kein Modus gewählt → StartScreen
    if (!selectedMode) {
      return (
        <StartScreen
          onModeSelect={setSelectedMode}
          onLogout={logout}
          user={user}
        />
      );
    }

    // Pen & Paper Modus (normal)
    if (selectedMode === "penandpaper") {
      return (
        <DataProvider>
          <PenAndPaperMode />
        </DataProvider>
      );
    }

    // Pen & Paper 18+ Modus
    if (selectedMode === "penandpaper18") {
      return (
        <DataProvider18Plus>
          <PenAndPaperMode18Plus />
        </DataProvider18Plus>
      );
    }

    // Hexagon Story Modus
    if (selectedMode === "hexagon") {
      return (
        <HexagonProvider>
          <HexagonGMView />
        </HexagonProvider>
      );
    }
  }

  return null;
}

// Haupt-App mit AuthProvider
function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
