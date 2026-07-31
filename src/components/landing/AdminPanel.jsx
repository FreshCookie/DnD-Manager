import React, { useState } from "react";
import { X, Save, Plus, Trash2, Edit2, Upload } from "lucide-react";
import { compressImage } from "../../utils/imageCompression";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function AdminPanel({ data, onSave, onClose }) {
  const [editData, setEditData] = useState(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState("siteInfo");
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const dataUrl = await compressImage(file, 1600, 0.82);
      const res = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dataUrl }),
      });
      const result = await res.json();
      if (result.url) {
        setEditData((prev) => ({
          ...prev,
          siteInfo: { ...prev.siteInfo, bannerImage: result.url },
        }));
      } else {
        alert(result.error || "Upload fehlgeschlagen");
      }
    } catch {
      alert("Bild konnte nicht hochgeladen werden");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSave = () => {
    onSave(editData);
  };

  // Game Master Funktionen
  const addGM = () => {
    const newGM = {
      id: Date.now(),
      name: "Neuer GM",
      avatar: "",
      bio: "",
      style: "",
    };
    setEditData({
      ...editData,
      gameMasters: [...editData.gameMasters, newGM],
    });
  };

  const updateGM = (gmId, field, value) => {
    setEditData({
      ...editData,
      gameMasters: editData.gameMasters.map((gm) =>
        gm.id === gmId ? { ...gm, [field]: value } : gm,
      ),
    });
  };

  const deleteGM = (gmId) => {
    if (confirm("GM wirklich löschen?")) {
      setEditData({
        ...editData,
        gameMasters: editData.gameMasters.filter((gm) => gm.id !== gmId),
      });
    }
  };

  // Campaign Funktionen
  const addCampaign = () => {
    const newCampaign = {
      id: Date.now(),
      gmId: editData.gameMasters[0]?.id || null,
      gmName: editData.gameMasters[0]?.name || "",
      title: "Neue Kampagne",
      description: "",
      setting: "",
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      image: "",
      sessions: [],
    };
    setEditData({
      ...editData,
      campaigns: [...editData.campaigns, newCampaign],
    });
  };

  const updateCampaign = (campaignId, field, value) => {
    setEditData({
      ...editData,
      campaigns: editData.campaigns.map((c) => {
        if (c.id === campaignId) {
          const updated = { ...c, [field]: value };
          // Wenn GM geändert wird, auch gmName aktualisieren
          if (field === "gmId") {
            const gm = editData.gameMasters.find((g) => g.id === value);
            updated.gmName = gm?.name || "";
          }
          return updated;
        }
        return c;
      }),
    });
  };

  const deleteCampaign = (campaignId) => {
    if (confirm("Kampagne wirklich löschen?")) {
      setEditData({
        ...editData,
        campaigns: editData.campaigns.filter((c) => c.id !== campaignId),
      });
    }
  };

  // Session Funktionen
  const addSession = (campaignId) => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: "Neue Session",
      summary: "",
      location: "",
      image: "",
    };
    setEditData({
      ...editData,
      campaigns: editData.campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, sessions: [newSession, ...(c.sessions || [])] }
          : c,
      ),
    });
    setEditingItem(newSession.id);
  };

  const updateSession = (campaignId, sessionId, field, value) => {
    setEditData({
      ...editData,
      campaigns: editData.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              sessions: c.sessions.map((s) =>
                s.id === sessionId ? { ...s, [field]: value } : s,
              ),
            }
          : c,
      ),
    });
  };

  const deleteSession = (campaignId, sessionId) => {
    if (confirm("Session wirklich löschen?")) {
      setEditData({
        ...editData,
        campaigns: editData.campaigns.map((c) =>
          c.id === campaignId
            ? { ...c, sessions: c.sessions.filter((s) => s.id !== sessionId) }
            : c,
        ),
      });
    }
  };
  // Event Funktionen
  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: "Neues Event",
      description: "",
      location: "",
      image: "",
      type: "social",
    };
    setEditData({
      ...editData,
      events: [newEvent, ...(editData.events || [])],
    });
    setEditingItem(newEvent.id);
  };

  const updateEvent = (eventId, field, value) => {
    setEditData({
      ...editData,
      events: editData.events.map((e) =>
        e.id === eventId ? { ...e, [field]: value } : e,
      ),
    });
  };

  const deleteEvent = (eventId) => {
    if (confirm("Event wirklich löschen?")) {
      setEditData({
        ...editData,
        events: editData.events.filter((e) => e.id !== eventId),
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Schließen
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("siteInfo")}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "siteInfo"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Website-Info
            </button>
            <button
              onClick={() => setActiveTab("gameMasters")}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "gameMasters"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Game Masters
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "campaigns"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Kampagnen
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "events"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "about"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Über uns
            </button>
          </div>

          <div className="p-6">
            {/* Site Info Tab */}
            {activeTab === "siteInfo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Titel</label>
                  <input
                    type="text"
                    value={editData.siteInfo.title}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        siteInfo: {
                          ...editData.siteInfo,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Untertitel</label>
                  <input
                    type="text"
                    value={editData.siteInfo.subtitle}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        siteInfo: {
                          ...editData.siteInfo,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    Banner-Bild
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editData.siteInfo.bannerImage || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          siteInfo: {
                            ...editData.siteInfo,
                            bannerImage: e.target.value,
                          },
                        })
                      }
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
                      placeholder="/images/banner.jpg"
                    />
                    <label className="shrink-0 flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      {isUploadingBanner ? "…" : "Hochladen"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingBanner}
                        onChange={handleBannerUpload}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    Willkommenstext
                  </label>
                  <textarea
                    value={editData.siteInfo.welcomeText || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        siteInfo: {
                          ...editData.siteInfo,
                          welcomeText: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    value={editData.siteInfo.description || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        siteInfo: {
                          ...editData.siteInfo,
                          description: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Game Masters Tab */}
            {activeTab === "gameMasters" && (
              <div>
                <button
                  onClick={addGM}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Neuer GM
                </button>

                <div className="space-y-4">
                  {editData.gameMasters.map((gm) => (
                    <div
                      key={gm.id}
                      className="bg-gray-700 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <input
                          type="text"
                          value={gm.name}
                          onChange={(e) =>
                            updateGM(gm.id, "name", e.target.value)
                          }
                          className="text-xl font-bold bg-gray-600 text-white px-3 py-1 rounded flex-1 mr-2"
                          placeholder="GM Name"
                        />
                        <button
                          onClick={() => deleteGM(gm.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">
                          Bio
                        </label>
                        <textarea
                          value={gm.bio || ""}
                          onChange={(e) =>
                            updateGM(gm.id, "bio", e.target.value)
                          }
                          rows={2}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                          placeholder="Kurze Beschreibung..."
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">
                          Spielstil
                        </label>
                        <input
                          type="text"
                          value={gm.style || ""}
                          onChange={(e) =>
                            updateGM(gm.id, "style", e.target.value)
                          }
                          className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                          placeholder="z.B. Rollenspiellastig, Combat-fokussiert..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === "campaigns" && (
              <div>
                <button
                  onClick={addCampaign}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Neue Kampagne
                </button>

                <div className="space-y-6">
                  {editData.campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-gray-700 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <input
                          type="text"
                          value={campaign.title}
                          onChange={(e) =>
                            updateCampaign(campaign.id, "title", e.target.value)
                          }
                          className="text-xl font-bold bg-gray-600 text-white px-3 py-1 rounded flex-1 mr-2"
                          placeholder="Kampagnen-Titel"
                        />
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">
                            Game Master
                          </label>
                          <select
                            value={campaign.gmId || ""}
                            onChange={(e) =>
                              updateCampaign(
                                campaign.id,
                                "gmId",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                          >
                            {editData.gameMasters.map((gm) => (
                              <option key={gm.id} value={gm.id}>
                                {gm.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">
                            Status
                          </label>
                          <select
                            value={campaign.status}
                            onChange={(e) =>
                              updateCampaign(
                                campaign.id,
                                "status",
                                e.target.value,
                              )
                            }
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                          >
                            <option value="active">Aktiv</option>
                            <option value="paused">Pausiert</option>
                            <option value="completed">Abgeschlossen</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">
                            Setting
                          </label>
                          <input
                            type="text"
                            value={campaign.setting || ""}
                            onChange={(e) =>
                              updateCampaign(
                                campaign.id,
                                "setting",
                                e.target.value,
                              )
                            }
                            className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                            placeholder="z.B. Forgotten Realms"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">
                            Startdatum
                          </label>
                          <input
                            type="date"
                            value={campaign.startDate || ""}
                            onChange={(e) =>
                              updateCampaign(
                                campaign.id,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-1">
                          Beschreibung
                        </label>
                        <textarea
                          value={campaign.description || ""}
                          onChange={(e) =>
                            updateCampaign(
                              campaign.id,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                          placeholder="Kampagnen-Beschreibung..."
                        />
                      </div>

                      {/* Sessions Section */}
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-semibold">
                            Sessions ({campaign.sessions?.length || 0})
                          </h4>
                          <button
                            onClick={() => addSession(campaign.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            Session
                          </button>
                        </div>

                        <div className="space-y-2">
                          {campaign.sessions?.map((session) => (
                            <div
                              key={session.id}
                              className="bg-gray-600 rounded p-3 space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <input
                                  type="text"
                                  value={session.title}
                                  onChange={(e) =>
                                    updateSession(
                                      campaign.id,
                                      session.id,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="font-semibold bg-gray-500 text-white px-2 py-1 rounded flex-1 mr-2 text-sm"
                                  placeholder="Session-Titel"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      setEditingItem(
                                        editingItem === session.id
                                          ? null
                                          : session.id,
                                      )
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteSession(campaign.id, session.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {editingItem === session.id && (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-gray-300 text-xs mb-1">
                                        Datum
                                      </label>
                                      <input
                                        type="date"
                                        value={session.date}
                                        onChange={(e) =>
                                          updateSession(
                                            campaign.id,
                                            session.id,
                                            "date",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full bg-gray-500 text-white px-2 py-1 rounded text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-300 text-xs mb-1">
                                        Ort
                                      </label>
                                      <input
                                        type="text"
                                        value={session.location || ""}
                                        onChange={(e) =>
                                          updateSession(
                                            campaign.id,
                                            session.id,
                                            "location",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full bg-gray-500 text-white px-2 py-1 rounded text-sm"
                                        placeholder="Ort"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-gray-300 text-xs mb-1">
                                      Zusammenfassung
                                    </label>
                                    <textarea
                                      value={session.summary || ""}
                                      onChange={(e) =>
                                        updateSession(
                                          campaign.id,
                                          session.id,
                                          "summary",
                                          e.target.value,
                                        )
                                      }
                                      rows={3}
                                      className="w-full bg-gray-500 text-white px-2 py-1 rounded text-sm"
                                      placeholder="Was ist passiert?"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <button
                  onClick={addEvent}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Neues Event
                </button>

                <div className="space-y-4">
                  {(editData.events || []).map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-700 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) =>
                            updateEvent(event.id, "title", e.target.value)
                          }
                          className="text-xl font-bold bg-gray-600 text-white px-3 py-1 rounded flex-1 mr-2"
                          placeholder="Event-Titel"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditingItem(
                                editingItem === event.id ? null : event.id,
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {editingItem === event.id && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">
                                Datum
                              </label>
                              <input
                                type="date"
                                value={event.date}
                                onChange={(e) =>
                                  updateEvent(event.id, "date", e.target.value)
                                }
                                className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">
                                Ort
                              </label>
                              <input
                                type="text"
                                value={event.location || ""}
                                onChange={(e) =>
                                  updateEvent(
                                    event.id,
                                    "location",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                                placeholder="z.B. Paulaner Garten"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">
                              Beschreibung
                            </label>
                            <textarea
                              value={event.description || ""}
                              onChange={(e) =>
                                updateEvent(
                                  event.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={4}
                              className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                              placeholder="Was war los?"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">
                              Bild-URL
                            </label>
                            <input
                              type="text"
                              value={event.image || ""}
                              onChange={(e) =>
                                updateEvent(event.id, "image", e.target.value)
                              }
                              className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                              placeholder="/images/event.jpg"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Gruppen-Beschreibung
                  </label>
                  <textarea
                    value={editData.about.groupDescription || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        about: {
                          ...editData.about,
                          groupDescription: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Spielstil</label>
                  <textarea
                    value={editData.about.playStyle || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        about: {
                          ...editData.about,
                          playStyle: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Treff-Info</label>
                  <textarea
                    value={editData.about.meetingInfo || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        about: {
                          ...editData.about,
                          meetingInfo: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
