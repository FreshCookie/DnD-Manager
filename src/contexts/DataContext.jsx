import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

// API Base URL - ändere das auf deine ngrok URL wenn du von extern zugreifst
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [stories, setStories] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [intros, setIntros] = useState([]);
  const [currentView, setCurrentView] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentNPC, setCurrentNPC] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionTimes, setSessionTimes] = useState({});
  const [players, setPlayers] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [activePlayers, setActivePlayers] = useState([]); // IDs der aktiven Spieler
  const [subLocations, setSubLocations] = useState([]);

  // Lade Daten vom Server
  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/data`);
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
        setStories(data.stories || []);
        setNpcs(data.npcs || []);
        setLocations(data.locations || []);
        setItems(data.items || []);
        setIntros(data.intros || []);
        setTheme(data.theme || "dark");
        setSessionTimes(data.sessionTimes || {});
        setPlayers(data.players || []);
        setCompanions(data.companions || []);
        setActivePlayers(data.activePlayers || []);
        setSubLocations(data.subLocations || []);
        console.log("✅ Daten erfolgreich vom Server geladen");
      }
    } catch (error) {
      console.error("❌ Fehler beim Laden der Daten:", error);
      // Fallback auf LocalStorage wenn Server nicht erreichbar
      const savedData = localStorage.getItem("dnd-session-data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setCities(parsed.cities || []);
        setStories(parsed.stories || []);
        setNpcs(parsed.npcs || []);
        setLocations(parsed.locations || []);
        setItems(parsed.items || []);
        setIntros(parsed.intros || []);
        setTheme(parsed.theme || "dark");
        setSessionTimes(parsed.sessionTimes || {});
        setPlayers(parsed.players || []);
        setCompanions(parsed.companions || []);
        setActivePlayers(parsed.activePlayers || []);
        console.log("⚠️ Fallback: Daten aus LocalStorage geladen");
      }
    } finally {
      setIsLoaded(true);
    }
  };

  // Speichere Daten auf den Server
  const saveData = async () => {
    if (!isLoaded || isSaving) return;

    setIsSaving(true);
    const dataToSave = {
      cities,
      stories,
      npcs,
      locations,
      items,
      intros,
      sessionTimes,
      players,
      companions,
      activePlayers,
      subLocations,
      theme,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        console.log("✅ Daten erfolgreich auf Server gespeichert");
        // Auch in LocalStorage als Backup
        localStorage.setItem("dnd-session-data", JSON.stringify(dataToSave));
      } else {
        console.error("❌ Fehler beim Speichern auf Server");
        // Fallback auf LocalStorage
        localStorage.setItem("dnd-session-data", JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error("❌ Netzwerkfehler beim Speichern:", error);
      // Fallback auf LocalStorage
      localStorage.setItem("dnd-session-data", JSON.stringify(dataToSave));
    } finally {
      setIsSaving(false);
    }
  };

  // Lade Daten beim Start
  useEffect(() => {
    loadData();
  }, []);

  // Auto-Save bei Änderungen (mit Debounce)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      saveData();
    }, 1000); // Speichert 1 Sekunde nach der letzten Änderung

    return () => clearTimeout(timeoutId);
  }, [
    cities,
    stories,
    npcs,
    locations,
    items,
    intros,
    theme,
    sessionTimes,
    players,
    companions,
    activePlayers,
    subLocations,
    isLoaded,
  ]);

  // BroadcastChannel für Player View
  const broadcast = new BroadcastChannel("dnd-session");

  const sendToPlayerView = (data) => {
    broadcast.postMessage(data);

    if (data.type === "location") {
      setCurrentLocation(data.data);
      setCurrentNPC(null);
    } else if (data.type === "npc") {
      setCurrentNPC(data.data);
      setCurrentLocation(null);
    } else if (data.type === "both") {
      setCurrentLocation(data.location);
      setCurrentNPC(data.npc);
    } else if (
      data.type === "direktor" ||
      data.type === "challenge" ||
      data.type === "item"
    ) {
      setCurrentLocation(null);
      setCurrentNPC(null);
    }
  };

  const value = {
    cities,
    setCities,
    stories,
    setStories,
    npcs,
    setNpcs,
    locations,
    setLocations,
    items,
    setItems,
    intros,
    setIntros,
    sessionTimes,
    setSessionTimes,
    players,
    setPlayers,
    companions,
    setCompanions,
    activePlayers,
    setActivePlayers,
    currentView,
    setCurrentView,
    selectedCity,
    setSelectedCity,
    selectedStory,
    setSelectedStory,
    theme,
    setTheme,
    sendToPlayerView,
    currentLocation,
    setCurrentLocation,
    currentNPC,
    setCurrentNPC,
    subLocations,
    setSubLocations,
    isSaving,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
