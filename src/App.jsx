import React, { useState, useEffect } from "react";
import { DataProvider } from "./contexts/DataContext";
import { HexagonProvider } from "./contexts/HexagonContext";
import GMView from "./components/GMView";
import SoundManager from "./components/SoundManager";
import StartScreen from "./components/StartScreen";
import HexagonGMView from "./components/HexagonGMView";
import PreloadScreen from "./components/PreloadScreen";
import PenAndPaperMode from "./components/PenAndPaperMode";
import PenAndPaperMode18Plus from "./components/PenAndPaperMode18Plus";

function App() {
  const [selectedMode, setSelectedMode] = useState(null);

  // ESC-Taste zum Zurückkehren zum Start-Screen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedMode(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Start-Screen anzeigen wenn kein Modus gewählt wurde
  if (!selectedMode) {
    return <StartScreen onModeSelect={setSelectedMode} />;
  }

  // Pen & Paper Modus
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
      <DataProvider>
        <PenAndPaperMode18Plus />
      </DataProvider>
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

  return null;
}

export default App;
