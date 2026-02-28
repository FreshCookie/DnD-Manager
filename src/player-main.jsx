import React from "react";
import ReactDOM from "react-dom/client";
import PlayerView from "./components/PlayerView.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("player-root")).render(
  <React.StrictMode>
    <PlayerView />
  </React.StrictMode>,
);
