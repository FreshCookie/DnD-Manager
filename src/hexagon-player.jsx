import React from "react";
import ReactDOM from "react-dom/client";
import { HexagonProvider } from "./contexts/HexagonContext";
import HexagonPlayerView from "./components/HexagonPlayerView";
import "./index.css";

// Hole Spieler-ID aus URL Parameter (falls vorhanden)
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get("playerId");

ReactDOM.createRoot(document.getElementById("hexagon-player-root")).render(
  <React.StrictMode>
    <HexagonProvider>
      <HexagonPlayerView playerId={playerId} />
    </HexagonProvider>
  </React.StrictMode>
);
