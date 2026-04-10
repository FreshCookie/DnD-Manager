import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const DataContext18Plus = createContext();

// API Base URL - ändere das auf deine ngrok URL wenn du von extern zugreifst
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const useData18Plus = () => {
  const context = useContext(DataContext18Plus);
  if (!context) {
    throw new Error("useData18Plus must be used within a DataProvider18Plus");
  }
  return context;
};

export const DataProvider18Plus = ({ children }) => {
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
  const [activePlayers, setActivePlayers] = useState([]);
  const [subLocations, setSubLocations] = useState([]);

  // Lade 18+ Daten vom Server
  const loadData = async () => {
    console.time("⏱️ 18+ Gesamte Ladezeit");
    try {
      console.time("⏱️ 18+ Fetch Request");
      const response = await fetch(`${API_BASE_URL}/api/data-18plus`);
      console.timeEnd("⏱️ 18+ Fetch Request");

      if (response.ok) {
        console.time("⏱️ 18+ JSON Parse");
        const data = await response.json();
        console.timeEnd("⏱️ 18+ JSON Parse");

        console.time("⏱️ 18+ Migration");
        const migratedNpcs = migrateDescriptions(data.npcs || []);
        const migratedLocations = migrateDescriptions(data.locations || []);
        const migratedSubLocations = migrateDescriptions(
          data.subLocations || [],
        );
        console.timeEnd("⏱️ 18+ Migration");

        console.time("⏱️ 18+ Set States");
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
        console.timeEnd("⏱️ 18+ Set States");

        console.log("✅ 18+ Daten erfolgreich vom Server geladen und migriert");
        console.log("Migrierte NPCs:", migratedNpcs.length);
        console.log("Migrierte Locations:", migratedLocations.length);
        console.log("Migrierte SubLocations:", migratedSubLocations.length);
      } else {
        console.warn("⚠️ Server-Fehler, lade 18+ aus LocalStorage");
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Netzwerkfehler beim Laden der 18+ Daten:", error);
      loadFromLocalStorage();
    } finally {
      console.timeEnd("⏱️ 18+ Gesamte Ladezeit");
      setIsLoaded(true);
    }
  };

  // Migration: Konvertiere alte single description zu descriptions Array
  const migrateDescriptions = (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => {
      if (item.descriptions && Array.isArray(item.descriptions)) {
        const { description: _description, ...rest } = item;
        return rest;
      }

      if (
        item.description &&
        typeof item.description === "string" &&
        item.description.trim()
      ) {
        const { description: _description, ...rest } = item;
        return {
          ...rest,
          descriptions: [
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: "",
              text: _description,
              showToPlayers: false,
              createdAt: Date.now(),
            },
          ],
        };
      }

      const { description: _description2, ...rest } = item;
      return { ...rest, descriptions: [] };
    });
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("dnd-session-data-18plus");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCities(parsed.cities || []);
      setStories(parsed.stories || []);
      setNpcs(migrateDescriptions(parsed.npcs || []));
      setLocations(migrateDescriptions(parsed.locations || []));
      setSubLocations(migrateDescriptions(parsed.subLocations || []));
      setItems(parsed.items || []);
      setIntros(parsed.intros || []);
      setTheme(parsed.theme || "dark");
      setSessionTimes(parsed.sessionTimes || {});
      setPlayers(parsed.players || []);
      setCompanions(parsed.companions || []);
      setActivePlayers(parsed.activePlayers || []);
      console.log("📦 18+ Daten aus LocalStorage geladen");
    }
  };

  // Speichere 18+ Daten auf den Server
  const saveData = async () => {
    if (!isLoaded || isSaving) return;

    setIsSaving(true);

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
      const response = await fetch(`${API_BASE_URL}/api/data-18plus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        console.log("✅ 18+ Daten erfolgreich auf Server gespeichert");
        localStorage.setItem(
          "dnd-session-data-18plus",
          JSON.stringify(dataToSave),
        );
      } else {
        console.error("❌ Fehler beim Speichern der 18+ Daten auf Server");
        localStorage.setItem(
          "dnd-session-data-18plus",
          JSON.stringify(dataToSave),
        );
      }
    } catch (error) {
      console.error("❌ Netzwerkfehler beim Speichern der 18+ Daten:", error);
      localStorage.setItem(
        "dnd-session-data-18plus",
        JSON.stringify(dataToSave),
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Lade Daten beim Start
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-Save bei Änderungen (mit Debounce)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      saveData();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    console.log("🔌 DataContext18Plus: Connecting to Socket.io at", socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("🔌 DataContext18Plus: Socket.io connected!", newSocket.id);
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
      console.log("🔌 DataContext18Plus: Socket.io disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendToPlayerView = (data) => {
    console.log("🚀 GM sending to PlayerView (18+) via Socket.io:", data);
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
      data.type === "item" ||
      data.type === "kinksReference"
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

  return (
    <DataContext18Plus.Provider value={value}>
      {children}
    </DataContext18Plus.Provider>
  );
};
