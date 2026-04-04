import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const PreloadScreen = ({ mode, onComplete, data = {} }) => {
  const [progress, setProgress] = useState(0);
  const [totalResources, setTotalResources] = useState(0);
  const [currentResource, setCurrentResource] = useState("");
  const [errorResource, setErrorResource] = useState(null);

  // Audio-Dateien (hardcoded basierend auf Ordnerstruktur)
  const audioFiles = [
    { path: "/music/ambient/Dramatic.mp3", name: "Audio Ambient Dramatik" },
    { path: "/music/ambient/Festival.mp3", name: "Audio Ambient Festival" },
    {
      path: "/music/ambient/Mysteriöser Wald.mp3",
      name: "Audio Ambient Mysteriöser Wald",
    },
    { path: "/music/ambient/Neutral.mp3", name: "Audio Ambient Neutral" },
    { path: "/music/combat/Kampf.mp3", name: "Audio Kampf" },
    {
      path: "/music/combat/Plötzlicher Kampf.mp3",
      name: "Audio Plötzlicher Kampf",
    },
    { path: "/music/market/Markt.mp3", name: "Audio Markt" },
    { path: "/music/tavern/Taverne.mp3", name: "Audio Taverne" },
  ];

  // Preload Audio-Datei
  const preloadAudio = (url) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.oncanplaythrough = () => resolve(url);
      audio.onerror = () => reject(new Error(`Failed to load: ${url}`));
      audio.src = url;
      audio.load();
    });
  };

  // Preload Bild
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  };

  // Sammle alle zu ladenden Ressourcen basierend auf Modus
  const collectResources = () => {
    const resources = [];

    if (mode === "initial") {
      // Audio-Dateien hinzufügen
      audioFiles.forEach((audio) => {
        resources.push({
          type: "audio",
          path: audio.path,
          name: audio.name,
        });
      });

      // Companion Bilder
      if (data.companions && Array.isArray(data.companions)) {
        data.companions.forEach((companion) => {
          if (companion.image) {
            resources.push({
              type: "image",
              path: companion.image,
              name: `Bild Companion ${companion.name}`,
            });
          }
        });
      }

      // Spieler Bilder
      if (data.players && Array.isArray(data.players)) {
        data.players.forEach((player) => {
          if (player.image) {
            resources.push({
              type: "image",
              path: player.image,
              name: `Bild Spieler ${player.name}`,
            });
          }
        });
      }

      // Stadt Bilder
      if (data.cities && Array.isArray(data.cities)) {
        data.cities.forEach((city) => {
          if (city.image) {
            resources.push({
              type: "image",
              path: city.image,
              name: `Bild Stadt ${city.name}`,
            });
          }
        });
      }

      // Item Bilder
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach((item) => {
          if (item.image) {
            resources.push({
              type: "image",
              path: item.image,
              name: `Bild Item ${item.name}`,
            });
          }
        });
      }
    } else if (mode === "story") {
      // Story-spezifische Daten laden
      const { selectedStory, locations, npcs, intros } = data;

      // D-Rektor Intro Bilder
      if (intros && Array.isArray(intros)) {
        const storyIntro = intros.find((i) => i.storyId === selectedStory?.id);
        if (storyIntro?.image) {
          resources.push({
            type: "image",
            path: storyIntro.image,
            name: "Bild D-Rektor Intro",
          });
        }
      }

      // Location Bilder für diese Story
      if (locations && Array.isArray(locations)) {
        const storyLocations = locations.filter(
          (l) =>
            l.storyId === selectedStory?.id ||
            (l.cityId === data.selectedCity?.id && !l.storyId),
        );
        storyLocations.forEach((location) => {
          if (location.image) {
            resources.push({
              type: "image",
              path: location.image,
              name: `Bild Location ${location.name}`,
            });
          }
        });
      }

      // NPC Bilder für diese Story
      if (npcs && Array.isArray(npcs)) {
        const storyNPCs = npcs.filter(
          (n) => n.storyId === selectedStory?.id || !n.storyId,
        );
        storyNPCs.forEach((npc) => {
          if (npc.images && Array.isArray(npc.images)) {
            npc.images.forEach((img, idx) => {
              if (img) {
                resources.push({
                  type: "image",
                  path: img,
                  name: `Bild NPC ${npc.name}${idx > 0 ? ` (${idx + 1})` : ""}`,
                });
              }
            });
          }
        });
      }
    }

    return resources;
  };

  // Lade eine einzelne Ressource mit Retry-Logik
  const loadResource = async (resource) => {
    try {
      setCurrentResource(resource.name);
      if (resource.type === "audio") {
        await preloadAudio(resource.path);
      } else if (resource.type === "image") {
        await preloadImage(resource.path);
      }
      setProgress((prev) => prev + 1);
      return true;
    } catch {
      // Zeige Error-Popup
      return new Promise((resolve) => {
        setErrorResource({
          resource,
          onRetry: () => {
            setErrorResource(null);
            resolve("retry");
          },
          onSkip: () => {
            setErrorResource(null);
            setProgress((prev) => prev + 1);
            resolve("skip");
          },
        });
      });
    }
  };

  // Hauptlade-Logik
  useEffect(() => {
    console.log("� PreloadScreen gestartet:", { mode });

    const loadAllResources = async () => {
      console.time("⏱️ Alle Ressourcen laden");
      const resources = collectResources();
      console.log("📦 Ressourcen gefunden:", resources.length);
      setTotalResources(resources.length);

      // Wenn keine Ressourcen, sofort fertig
      if (resources.length === 0) {
        console.log("✅ Keine Ressourcen zum Laden");
        onComplete();
        return;
      }

      // Lade alle Ressourcen nacheinander
      for (const resource of resources) {
        console.time(`⏱️ ${resource.name}`);
        let result = await loadResource(resource);
        console.timeEnd(`⏱️ ${resource.name}`);
        while (result === "retry") {
          console.log("🔄 Retry:", resource.name);
          result = await loadResource(resource);
        }
      }

      // Alle geladen → fertig
      console.timeEnd("⏱️ Alle Ressourcen laden");
      console.log("✅ Alle Ressourcen fertig geladen");
      onComplete();
    };

    loadAllResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/30">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "initial"
              ? "Pen and Paper wird geladen..."
              : "Story wird geladen..."}
          </h1>
          <p className="text-gray-400">
            Bitte warten, während alle Ressourcen geladen werden
          </p>
        </div>

        {/* Progress Bar - nur anzeigen wenn Ressourcen geladen werden */}
        {totalResources > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                {progress} / {totalResources}
              </span>
              <span>{Math.round((progress / totalResources) * 100)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{
                  width: `${(progress / totalResources) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Current Resource */}
        <div className="flex items-center justify-center gap-3 text-gray-300">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span className="text-sm">{currentResource}</span>
        </div>
      </div>

      {/* Error Popup */}
      {errorResource && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-red-500/50 shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-3">Ladefehler</h3>
            <p className="text-gray-300 mb-6">
              <strong>{errorResource.resource.name}</strong> konnte nicht
              geladen werden. Möchtest du es überspringen oder erneut versuchen?
            </p>
            <div className="flex gap-3">
              <button
                onClick={errorResource.onSkip}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Überspringen
              </button>
              <button
                onClick={errorResource.onRetry}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreloadScreen;
