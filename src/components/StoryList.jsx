import React, { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { useData } from "../contexts/DataContext";
import StoryCard from "./StoryCard";
import StoryModal from "./StoryModal";
import { generateId } from "../utils/helpers";

const StoryList = ({ theme }) => {
  const { stories, setStories, selectedCity, selectedStory, setSelectedStory } =
    useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const cityStories = stories.filter((s) => s.cityId === selectedCity?.id);

  // Filter Stories
  const filteredStories =
    statusFilter === "all"
      ? cityStories
      : cityStories.filter((s) => s.status === statusFilter);

  // Statistiken
  const stats = {
    all: cityStories.length,
    wip: cityStories.filter((s) => s.status === "wip").length,
    ready: cityStories.filter((s) => s.status === "ready").length,
    completed: cityStories.filter((s) => s.status === "completed").length,
  };

  const handleAddStory = () => {
    setEditingStory(null);
    setIsModalOpen(true);
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleSaveStory = (storyData) => {
    if (editingStory) {
      // Story wird bearbeitet - behalte alle existierenden Daten
      setStories(
        stories.map((s) =>
          s.id === editingStory.id
            ? {
                ...editingStory,
                ...storyData,
              }
            : s,
        ),
      );
    } else {
      // Neue Story
      const newStory = {
        ...storyData,
        id: generateId(),
        cityId: selectedCity.id,
        createdAt: Date.now(),
        completionTime: 0,
      };
      setStories([...stories, newStory]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteStory = (storyId) => {
    if (window.confirm("Möchtest du diese Story wirklich löschen?")) {
      setStories(stories.filter((s) => s.id !== storyId));
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
      }
    }
  };

  if (!selectedCity) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-12 shadow-2xl text-center`}
      >
        <p className={`${theme.text} text-xl opacity-70`}>
          Wähle zuerst eine Stadt aus, um Storys zu verwalten.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl overflow-x-hidden w-full`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className={`${theme.text} text-xl md:text-2xl font-bold`}>
          Storys in {selectedCity.name}
        </h2>
        <button
          onClick={handleAddStory}
          className={`${theme.button} px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold text-sm md:text-base w-full md:w-auto justify-center`}
        >
          <Plus className="w-5 h-5" /> Neue Story
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className={`${theme.accent} w-5 h-5`} />
          <span className={`${theme.text} font-semibold text-sm md:text-base`}>
            Filter:
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 text-sm md:text-base ${
              statusFilter === "all"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            Alle
            <span
              className={`block text-xl md:text-2xl font-bold ${theme.accent}`}
            >
              {stats.all}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("wip")}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 text-sm md:text-base ${
              statusFilter === "wip"
                ? "bg-yellow-500/30 border-2 border-yellow-500 text-yellow-300"
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            WIP
            <span
              className={`block text-xl md:text-2xl font-bold ${
                statusFilter === "wip" ? "text-yellow-300" : theme.accent
              }`}
            >
              {stats.wip}/{stats.all}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("ready")}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 text-sm md:text-base ${
              statusFilter === "ready"
                ? "bg-blue-500/30 border-2 border-blue-500 text-blue-300"
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            Noch nicht gespielt
            <span
              className={`block text-xl md:text-2xl font-bold ${
                statusFilter === "ready" ? "text-blue-300" : theme.accent
              }`}
            >
              {stats.ready}/{stats.all}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 text-sm md:text-base ${
              statusFilter === "completed"
                ? "bg-green-500/30 border-2 border-green-500 text-green-300"
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            Abgeschlossen
            <span
              className={`block text-xl md:text-2xl font-bold ${
                statusFilter === "completed" ? "text-green-300" : theme.accent
              }`}
            >
              {stats.completed}/{stats.all}
            </span>
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {filteredStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            theme={theme}
            onClick={() => setSelectedStory(story)}
            onEdit={handleEditStory}
            onDelete={handleDeleteStory}
          />
        ))}
      </div>

      {filteredStories.length === 0 && cityStories.length > 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Keine Storys mit diesem Status gefunden.
        </div>
      )}

      {cityStories.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Storys vorhanden. Erstelle deine erste Story!
        </div>
      )}

      {isModalOpen && (
        <StoryModal
          theme={theme}
          story={editingStory}
          onSave={handleSaveStory}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StoryList;
