import React, { useState } from "react";
import { useData } from "../contexts/DataContext";
import { themes } from "../styles/themes";
import CitySelector from "./CitySelector";
import StoryList from "./StoryList";
import LocationWithNPCs from "./LocationWithNPCs";
import ItemManager from "./ItemManager";
import DiceRoller from "./DiceRoller";
import MusicPlayer from "./MusicPlayer";
import SessionTimer from "./SessionTimer";
import ThemeSelector from "./ThemeSelector";
import ChallengeTimer from "./ChallengeTimer";
import DRektorManager from "./DRektorManager";
import CurrentDisplayIndicator from "./CurrentDisplayIndicator";
import SoundControl from "./SoundControl";
import PlayersManager from "./PlayersManager";
import CompanionsLibrary from "./CompanionsLibrary";
import SessionNotes from "./SessionNotes";
import {
  BookOpen,
  MapPin,
  Package,
  Home,
  ExternalLink,
  Scroll,
  Users,
  Heart,
  FileText,
} from "lucide-react";

const GMView = () => {
  const { theme: themeKey, selectedStory } = useData();
  const theme = themes[themeKey];
  const [activeTab, setActiveTab] = useState("overview");

  const openPlayerView = () => {
    const playerUrl = window.location.origin + "/player.html";
    window.open(playerUrl, "PlayerView", "width=1920,height=1080");
  };

  return (
    <div className={`min-h-screen ${theme.bg} p-4`}>
      <div className="w-full mx-auto px-4">
        {/* Sound Control Button */}
        <SoundControl theme={theme} />
        {/* Header */}
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl mb-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`${theme.text} text-4xl font-bold mb-2`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                D&D Session Manager
              </h1>
              <p className={`${theme.accent} text-lg`}>Game Master View</p>
              {selectedStory && (
                <p className={`${theme.text} text-sm mt-2 opacity-70`}>
                  Aktive Story:{" "}
                  <span className={theme.accent}>{selectedStory.title}</span>
                </p>
              )}
            </div>
            <button
              onClick={openPlayerView}
              className={`${theme.button} px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold`}
            >
              <ExternalLink className="w-5 h-5" /> Player View öffnen
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Home className="w-5 h-5" /> Übersicht
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "stories"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <BookOpen className="w-5 h-5" /> Storys
          </button>
          <button
            onClick={() => setActiveTab("direktor")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "direktor"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Scroll className="w-5 h-5" /> D Rektor
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "locations"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <MapPin className="w-5 h-5" /> Locations & NPCs
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "items"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Package className="w-5 h-5" /> Items
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "players"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Users className="w-5 h-5" /> Spieler
          </button>
          <button
            onClick={() => setActiveTab("companions")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "companions"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Heart className="w-5 h-5" /> Companions
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <CitySelector theme={theme} />
                <StoryList theme={theme} />
              </>
            )}
            {activeTab === "stories" && <StoryList theme={theme} />}
            {activeTab === "direktor" && <DRektorManager theme={theme} />}
            {activeTab === "locations" && <LocationWithNPCs theme={theme} />}
            {activeTab === "items" && <ItemManager theme={theme} />}
            {activeTab === "players" && <PlayersManager theme={theme} />}
            {activeTab === "companions" && <CompanionsLibrary theme={theme} />}
          </div>

          {/* Right Column - Tools */}
          <div className="space-y-6">
            {selectedStory && selectedStory.id && (
              <SessionTimer
                key={selectedStory.id}
                theme={theme}
                storyId={selectedStory.id}
              />
            )}
            <SessionNotes theme={theme} />
            <ChallengeTimer theme={theme} />
            <CurrentDisplayIndicator theme={theme} />
            <DiceRoller theme={theme} />
            <MusicPlayer theme={theme} />
            <ThemeSelector theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GMView;
