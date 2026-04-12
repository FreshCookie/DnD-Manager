import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

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
  const [currentSubLocation, setCurrentSubLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionTimes, setSessionTimes] = useState({});
  const [players, setPlayers] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [activePlayers, setActivePlayers] = useState([]); // IDs der aktiven Spieler
  const [subLocations, setSubLocations] = useState([]);

  // Lade Daten vom Server
  const loadData = async () => {
    console.time("⏱️ Gesamte Ladezeit");
    try {
      console.time("⏱️ Fetch Request");
      const response = await fetch(`${API_BASE_URL}/api/data`);
      console.timeEnd("⏱️ Fetch Request");

      if (response.ok) {
        console.time("⏱️ JSON Parse");
        const data = await response.json();
        console.timeEnd("⏱️ JSON Parse");

        console.time("⏱️ Migration");
        const migratedNpcs = migrateDescriptions(data.npcs || []);
        const migratedLocations = migrateDescriptions(data.locations || []);
        const migratedSubLocations = migrateDescriptions(
          data.subLocations || [],
        );
        console.timeEnd("⏱️ Migration");

        console.time("⏱️ Set States");
        setCities(data.cities || []);
        setStories(data.stories || []);
        setNpcs(migratedNpcs);
        setLocations(migratedLocations);
        setSubLocations(migratedSubLocations);
        setItems(data.items || []);
        setIntros(data.intros || []);
        setTheme(data.theme || "dark");
        setSessionTimes(data.sessionTimes || {});
        setPlayers(data.players || []);
        setCompanions(data.companions || []);
        setActivePlayers(data.activePlayers || []);
        console.timeEnd("⏱️ Set States");

        console.log("✅ Daten erfolgreich vom Server geladen und migriert");
        console.log("Migrierte NPCs:", migratedNpcs.length);
        console.log("Migrierte Locations:", migratedLocations.length);
        console.log("Migrierte SubLocations:", migratedSubLocations.length);
      } else {
        // Server antwortet mit Fehler → Fallback auf LocalStorage
        console.warn("⚠️ Server-Fehler, lade aus LocalStorage");
        loadFromLocalStorage();
      }
    } catch (error) {
      // Netzwerkfehler → Fallback auf LocalStorage
      console.error("❌ Netzwerkfehler beim Laden der Daten:", error);
      loadFromLocalStorage();
    } finally {
      console.timeEnd("⏱️ Gesamte Ladezeit");
      setIsLoaded(true);
    }
  };

  // Migration: Konvertiere alte single description zu descriptions Array
  const migrateDescriptions = (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => {
      // Wenn descriptions Array bereits existiert
      if (item.descriptions && Array.isArray(item.descriptions)) {
        // Entferne alte description falls vorhanden
        const { description, ...rest } = item;
        return rest;
      }

      // Wenn alte description vorhanden - migriere zu descriptions Array
      if (
        item.description &&
        typeof item.description === "string" &&
        item.description.trim()
      ) {
        const { description, ...rest } = item;
        return {
          ...rest,
          descriptions: [
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: "",
              text: description,
              showToPlayers: false, // GM-Notiz per default
              createdAt: Date.now(),
            },
          ],
        };
      }

      // Keine description vorhanden - initialisiere leeres Array
      const { description, ...rest } = item;
      return { ...rest, descriptions: [] };
    });
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("dnd-session-data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCities(parsed.cities || []);
      setStories(parsed.stories || []);

      const migratedNpcs = migrateDescriptions(parsed.npcs || []);
      const migratedLocations = migrateDescriptions(parsed.locations || []);
      const migratedSubLocations = migrateDescriptions(
        parsed.subLocations || [],
      );

      setNpcs(migratedNpcs);
      setLocations(migratedLocations);
      setSubLocations(migratedSubLocations);

      setItems(parsed.items || []);
      setIntros(parsed.intros || []);
      setTheme(parsed.theme || "dark");
      setSessionTimes(parsed.sessionTimes || {});
      setPlayers(parsed.players || []);
      setCompanions(parsed.companions || []);
      setActivePlayers(parsed.activePlayers || []);

      console.log("📦 Daten aus LocalStorage geladen und migriert");
      console.log("Migrierte NPCs:", migratedNpcs.length);
      console.log("Migrierte Locations:", migratedLocations.length);
      console.log("Migrierte SubLocations:", migratedSubLocations.length);
    }
  };

  // Speichere Daten auf den Server
  const saveData = async () => {
    if (!isLoaded || isSaving) return;

    setIsSaving(true);

    // Migriere Daten vor dem Speichern (falls noch alte description Felder vorhanden)
    const dataToSave = {
      cities,
      stories,
      npcs: migrateDescriptions(npcs),
      locations: migrateDescriptions(locations),
      items,
      intros,
      sessionTimes,
      players,
      companions,
      activePlayers,
      subLocations: migrateDescriptions(subLocations),
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

  // Socket.io Connection für PlayerView Sync
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = API_BASE_URL || window.location.origin;
    console.log("🔌 DataContext: Connecting to Socket.io at", socketUrl);

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("🔌 DataContext: Socket.io connected!", newSocket.id);
    });

    // Empfange Error-Messages von PlayerView
    newSocket.on("player:image-error", (data) => {
      if (data?.type === "error" && data?.error === "image_load_failed") {
        alert(
          `Leider ist beim Anzeigen auf der Player View schief gelaufen.\n\nBild: ${data.item}\nPfad: ${data.image}`,
        );
      }
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 DataContext: Socket.io disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendToPlayerView = (data) => {
    console.log("🚀 GM sending to PlayerView via Socket.io:", data);
    if (socket && socket.connected) {
      socket.emit("gm:update-playerview", data);
    } else {
      console.warn("⚠️ Socket not connected, cannot send PlayerView update");
    }

    if (data.type === "location") {
      setCurrentLocation(data.data);
      setCurrentNPC(null);
      setCurrentSubLocation(null);
    } else if (data.type === "subLocation") {
      setCurrentSubLocation(data.data);
      setCurrentLocation(null);
      setCurrentNPC(null);
    } else if (data.type === "npc") {
      setCurrentNPC(data.data);
      setCurrentLocation(null);
      setCurrentSubLocation(null);
    } else if (data.type === "both") {
      // Check if location is actually a SubLocation
      if (data.location?.isSubLocation) {
        setCurrentSubLocation(data.location);
        setCurrentLocation(null);
      } else {
        setCurrentLocation(data.location);
        setCurrentSubLocation(null);
      }
      setCurrentNPC(data.npc);
    } else if (
      data.type === "direktor" ||
      data.type === "challenge" ||
      data.type === "item"
    ) {
      setCurrentLocation(null);
      setCurrentNPC(null);
      setCurrentSubLocation(null);
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
    currentSubLocation,
    setCurrentSubLocation,
    subLocations,
    setSubLocations,
    isSaving,
    isLoaded,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
