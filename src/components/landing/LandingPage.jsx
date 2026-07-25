import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Users,
  Image as ImageIcon,
  LogIn,
  Sword,
  Beer,
} from "lucide-react";
import Banner from "./Banner";
import TabNavigation from "./TabNavigation";
import CampaignCard from "./CampaignCard";
import CampaignDetailView from "./CampaignDetailView";
import AdminPanel from "./AdminPanel";

export default function LandingPage() {
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lade Landing Page Daten
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_BASE_URL}/api/landing-data`);
      const data = await response.json();
      setLandingData(data);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const password = prompt("Admin-Passwort:");
    if (password === "020266140297") {
      setIsAuthenticated(true);
      setShowAdmin(true);
    } else {
      alert("Falsches Passwort!");
    }
  };

  const handleSaveData = async (updatedData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_BASE_URL}/api/landing-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setLandingData(updatedData);
        alert("Erfolgreich gespeichert!");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade...</div>
      </div>
    );
  }

  if (showAdmin && isAuthenticated) {
    return (
      <AdminPanel
        data={landingData}
        onSave={handleSaveData}
        onClose={() => setShowAdmin(false)}
      />
    );
  }

  const { siteInfo, campaigns, about, gameMasters, members, events } =
    landingData;

  // Tab-Definitionen
  const tabs = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    {
      id: "campaigns",
      label: "Kampagnen",
      icon: <BookOpen className="w-5 h-5" />,
    },
    { id: "events", label: "Events", icon: <Beer className="w-5 h-5" /> },
    { id: "about", label: "Über uns", icon: <Users className="w-5 h-5" /> },
    {
      id: "gallery",
      label: "Gallery",
      icon: <ImageIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-900 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url(/images/background.jpg)" }}
    >
      {/* Dark Overlay for better readability */}
      <div className="min-h-screen bg-black bg-opacity-60">
        {/* Banner */}
        <Banner siteInfo={siteInfo} />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {/* Home Tab */}
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
                <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                  Willkommen!
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {siteInfo.welcomeText}
                </p>

                {/* Quick Access Button */}
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={() => setActiveTab("campaigns")}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <BookOpen className="w-5 h-5" />
                    Kampagnen entdecken
                  </button>
                </div>
              </div>

              {/* Latest Updates / Featured Campaigns */}
              <div>
                <h3 className="text-3xl font-bold text-white mb-6 font-serif">
                  Aktuelle Kampagnen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns
                    .filter((c) => c.status === "active")
                    .slice(0, 3)
                    .map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setActiveTab("campaigns");
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div>
              {selectedCampaign ? (
                <CampaignDetailView
                  campaign={selectedCampaign}
                  onBack={() => setSelectedCampaign(null)}
                />
              ) : (
                <div>
                  <h2 className="text-4xl font-bold text-white mb-8 font-serif">
                    Alle Kampagnen
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onClick={() => setSelectedCampaign(campaign)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-8">
              {/* Group Description */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
                <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                  Über die Landnerds
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {about.groupDescription}
                </p>
              </div>

              {/* Game Masters */}
              {gameMasters.length > 0 && (
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 font-serif">
                    Unsere Dungeon Masters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gameMasters.map((gm) => (
                      <div
                        key={gm.id}
                        className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            {gm.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">
                              {gm.name}
                            </h4>
                            <p className="text-amber-400 text-sm">
                              Dungeon Master
                            </p>
                          </div>
                        </div>
                        {gm.bio && (
                          <p className="text-gray-300 mb-3">{gm.bio}</p>
                        )}
                        {gm.style && (
                          <p className="text-sm text-purple-300">
                            <span className="text-gray-400">Stil:</span>{" "}
                            {gm.style}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Play Style & Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-white mb-3">
                    Spielstil
                  </h4>
                  <p className="text-gray-300">{about.playStyle}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-white mb-3">Treffen</h4>
                  <p className="text-gray-300">{about.meetingInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-white mb-8 font-serif">
                Geschichten aus dem Paulaner Garten
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/20 hover:border-amber-500/50 transition-all"
                    >
                      {/* Event Header */}
                      {event.image ? (
                        <div
                          className="h-48 bg-cover bg-center"
                          style={{ backgroundImage: `url(${event.image})` }}
                        >
                          <div className="h-full bg-gradient-to-t from-gray-900 to-transparent flex items-end p-6">
                            <h3 className="text-2xl font-bold text-white font-serif">
                              {event.title}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-amber-900 to-gray-900 flex items-center justify-center p-6">
                          <h3 className="text-2xl font-bold text-white font-serif text-center">
                            {event.title}
                          </h3>
                        </div>
                      )}

                      {/* Event Info */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 text-sm">
                          <Beer className="w-4 h-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {event.location && (
                          <div className="text-gray-400 text-sm">
                            📍 {event.location}
                          </div>
                        )}

                        {event.description && (
                          <p className="text-gray-300 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <Beer className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      Noch keine Events. Auf zum Paulaner Garten!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="text-center py-20">
              <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Gallery
              </h2>
              <p className="text-gray-400 text-lg">
                Kommt bald! Hier werden alle Bilder und Artworks angezeigt.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black bg-opacity-50 backdrop-blur-sm border-t border-purple-500/20 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2026 {siteInfo.title} - Eine D&D-Gruppe</p>
              <button
                onClick={handleLogin}
                className="mt-4 text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 mx-auto transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Admin-Login
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
