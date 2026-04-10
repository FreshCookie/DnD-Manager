import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import PreloadScreen from "./PreloadScreen";
import GMView18Plus from "./GMView18Plus";
import SoundManager from "./SoundManager";

const PenAndPaperMode18Plus = () => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [storyLoadComplete, setStoryLoadComplete] = useState(true); // Default true, wird false wenn Story gewählt wird
  const [previousStory, setPreviousStory] = useState(null);

  const {
    isLoaded,
    companions,
    players,
    cities,
    items,
    selectedStory,
    selectedCity,
    locations,
    npcs,
    intros,
  } = useData();

  // Debug: Log isLoaded Status
  useEffect(() => {
    console.log("📊 PenAndPaperMode18Plus - isLoaded:", isLoaded);
  }, [isLoaded]);

  // Wenn eine neue Story ausgewählt wird, Story-Preload triggern
  useEffect(() => {
    if (selectedStory && selectedStory.id !== previousStory?.id) {
      setStoryLoadComplete(false);
      setPreviousStory(selectedStory);
    }
  }, [selectedStory, previousStory]);

  // Warte bis DataContext Daten geladen hat
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Pen and Paper 18+ wird geladen...
            </h1>
            <p className="text-gray-400">Session-Daten werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  // Initial Preload (Audios, Bilder)
  if (!initialLoadComplete) {
    return (
      <PreloadScreen
        mode="initial"
        data={{ companions, players, cities, items }}
        onComplete={() => setInitialLoadComplete(true)}
      />
    );
  }

  // Story Preload noch nicht abgeschlossen
  if (!storyLoadComplete) {
    return (
      <PreloadScreen
        mode="story"
        data={{ selectedStory, selectedCity, locations, npcs, intros }}
        onComplete={() => setStoryLoadComplete(true)}
      />
    );
  }

  // Alles geladen → zeige GMView18Plus
  return (
    <>
      <SoundManager />
      <GMView18Plus />
    </>
  );
};

export default PenAndPaperMode18Plus;
