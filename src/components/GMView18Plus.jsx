import React, { useState } from "react";
import { useData18Plus } from "../contexts/DataContext18Plus";
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
import KinksReferenceLibrary from "./KinksReferenceLibrary";
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
  Book,
} from "lucide-react";

const GMView18Plus = () => {
  const { theme: themeKey, selectedStory, sendToPlayerView } = useData18Plus();
  const theme = themes[themeKey];
  const [activeTab, setActiveTab] = useState("overview");

  const openPlayerView = () => {
    const playerUrl = window.location.origin + "/player.html";
    window.open(playerUrl, "PlayerView", "width=1920,height=1080");
  };

  return (
    <div className={`min-h-screen ${theme.bg} p-2 md:p-4 overflow-x-hidden`}>
      <div className="w-full max-w-[100vw] mx-auto px-2 md:px-4 overflow-x-hidden">
        {/* Sound Control Button */}
        <SoundControl theme={theme} />
        {/* Header */}
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl mb-4 md:mb-6`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1
                className={`${theme.text} text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                D&D Session Manager 18+
              </h1>
              <p className={`${theme.accent} text-base md:text-lg`}>
                Game Master View
              </p>
              {selectedStory && (
                <p
                  className={`${theme.text} text-xs md:text-sm mt-2 opacity-70`}
                >
                  Aktive Story:{" "}
                  <span className={theme.accent}>{selectedStory.title}</span>
                </p>
              )}
            </div>
            <button
              onClick={openPlayerView}
              className={`${theme.button} px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold text-sm md:text-base whitespace-nowrap w-full md:w-auto justify-center`}
            >
              <ExternalLink className="w-5 h-5" /> Player View öffnen
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "overview"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Home className="w-5 h-5" /> Übersicht
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "stories"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <BookOpen className="w-5 h-5" /> Storys
          </button>
          <button
            onClick={() => setActiveTab("direktor")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "direktor"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Scroll className="w-5 h-5" /> D Rektor
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "locations"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <MapPin className="w-5 h-5" /> Locations & NPCs
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "items"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Package className="w-5 h-5" /> Items
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "players"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Users className="w-5 h-5" /> Spieler
          </button>
          <button
            onClick={() => setActiveTab("companions")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "companions"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Heart className="w-5 h-5" /> Companions
          </button>
          <button
            onClick={() => setActiveTab("kinks")}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "kinks"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <Book className="w-5 h-5" /> K&C Referenz
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 w-full overflow-x-hidden">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6 min-w-0">
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
            {activeTab === "kinks" && (
              <KinksReferenceLibrary
                theme={theme}
                sendToPlayerView={sendToPlayerView}
              />
            )}
          </div>

          {/* Right Column - Tools */}
          <div className="space-y-4 md:space-y-6 min-w-0">
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

export default GMView18Plus;
