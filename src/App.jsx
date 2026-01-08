import React from "react";
import { DataProvider } from "./contexts/DataContext";
import GMView from "./components/GMView";
import SoundManager from "./components/SoundManager";

function App() {
  return (
    <DataProvider>
      <SoundManager />
      <GMView />
    </DataProvider>
  );
}

export default App;
