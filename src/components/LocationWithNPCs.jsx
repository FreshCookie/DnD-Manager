import React, { useState, useRef } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Package,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";
import ImageSelector from "./ImageSelector";
import { playSound, stopSound } from "./SoundManager";
import { stopMusicPlayer } from "../utils/audioController";

const LocationWithNPCs = ({ theme }) => {
  const {
    locations,
    setLocations,
    npcs,
    setNpcs,
    selectedStory,
    selectedCity,
    sendToPlayerView,
    currentLocation,
    currentNPC,
    subLocations,
    setSubLocations,
  } = useData();
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isAddingNPC, setIsAddingNPC] = useState(null); // locationId
  const [isAddingNPCToSubLocation, setIsAddingNPCToSubLocation] =
    useState(null); // subLocationId
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingNPC, setEditingNPC] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [locationFilter, setLocationFilter] = useState("all");
  const [isAddingSubLocation, setIsAddingSubLocation] = useState(null); // locationId
  const [editingSubLocation, setEditingSubLocation] = useState(null);
  const [subLocationFormData, setSubLocationFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    description: "",
    images: [""],
    sound: "",
    isCityWide: false,
  });
  const [npcFormData, setNpcFormData] = useState({
    name: "",
    profession: "",
    description: "",
    images: [""],
    sound: "",
    isEnemy: false,
  });
  const locationImageRefs = useRef({});
  const npcImageRefs = useRef({});

  // Stadt-weite Locations + Story-spezifische Locations
  const storyLocations = locations.filter(
    (l) =>
      l.storyId === selectedStory?.id ||
      (l.cityId === selectedCity?.id && !l.storyId),
  );

  // Separate Listen für Filter
  const cityWideLocations = locations.filter(
    (l) => l.cityId === selectedCity?.id && !l.storyId,
  );
  const storySpecificLocations = locations.filter(
    (l) => l.storyId === selectedStory?.id,
  );

  const toggleLocation = (locationId) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [locationId]: !prev[locationId],
    }));
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getNPCsForLocation = (locationId) => {
    return npcs.filter(
      (n) => n.locationId === locationId && n.storyId === selectedStory?.id,
    );
  };

  // SubLocation Functions
  const resetSubLocationForm = () => {
    setSubLocationFormData({ name: "", description: "", image: "" });
    setIsAddingSubLocation(null);
    setEditingSubLocation(null);
  };

  const handleSaveSubLocation = (locationId) => {
    if (!subLocationFormData.name.trim()) {
      alert("Name ist ein Pflichtfeld!");
      return;
    }

    if (editingSubLocation) {
      setSubLocations(
        subLocations.map((sl) =>
          sl.id === editingSubLocation.id
            ? {
                ...subLocationFormData,
                id: editingSubLocation.id,
                locationId,
                storyId: selectedStory.id,
              }
            : sl,
        ),
      );
    } else {
      const newSubLocation = {
        ...subLocationFormData,
        id: generateId(),
        locationId,
        storyId: selectedStory.id,
        createdAt: Date.now(),
      };
      setSubLocations([...subLocations, newSubLocation]);
    }
    resetSubLocationForm();
  };

  const handleEditSubLocation = (subLocation) => {
    setEditingSubLocation(subLocation);
    setSubLocationFormData({
      name: subLocation.name,
      description: subLocation.description || "",
      image: subLocation.image || "",
    });
    setIsAddingSubLocation(subLocation.locationId);
  };

  const handleDeleteSubLocation = (subLocationId) => {
    if (window.confirm("Möchtest du dieses Objekt wirklich löschen?")) {
      setSubLocations(subLocations.filter((sl) => sl.id !== subLocationId));
    }
  };

  const showSubLocationToPlayers = (subLocation) => {
    sendToPlayerView({
      type: "subLocation",
      data: subLocation,
    });
  };

  const getSubLocationsForLocation = (locationId) => {
    return subLocations.filter((sl) => sl.locationId === locationId);
  };

  const getNPCsForSubLocation = (subLocationId) => {
    return npcs.filter(
      (n) =>
        n.subLocationId === subLocationId && n.storyId === selectedStory?.id,
    );
  };

  // Location Functions
  const resetLocationForm = () => {
    setLocationFormData({
      name: "",
      description: "",
      images: [""],
      sound: "",
      isCityWide: false,
    });
    setIsAddingLocation(false);
    setEditingLocation(null);
  };

  const handleSaveLocation = () => {
    if (!locationFormData.name.trim()) {
      alert("Name ist ein Pflichtfeld!");
      return;
    }

    const cleanImages = locationFormData.images.filter(
      (img) => img.trim() !== "",
    );

    if (editingLocation) {
      setLocations(
        locations.map((l) =>
          l.id === editingLocation.id
            ? {
                ...locationFormData,
                images: cleanImages,
                id: editingLocation.id,
                storyId: locationFormData.isCityWide ? null : selectedStory.id,
                cityId: locationFormData.isCityWide ? selectedCity.id : null,
              }
            : l,
        ),
      );
    } else {
      const newLocation = {
        ...locationFormData,
        images: cleanImages,
        id: generateId(),
        storyId: locationFormData.isCityWide ? null : selectedStory.id,
        cityId: locationFormData.isCityWide ? selectedCity.id : null,
        createdAt: Date.now(),
      };
      setLocations([...locations, newLocation]);
    }
    resetLocationForm();
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setLocationFormData({
      name: location.name,
      description: location.description || "",
      images:
        location.images && location.images.length > 0 ? location.images : [""],
      sound: location.sound || "",
      isCityWide: location.cityId ? true : false,
    });
    setIsAddingLocation(true);
  };

  const handleDeleteLocation = (locationId) => {
    if (
      window.confirm(
        "Möchtest du diese Location wirklich löschen? Alle zugehörigen NPCs werden ebenfalls gelöscht!",
      )
    ) {
      setLocations(locations.filter((l) => l.id !== locationId));
      setNpcs(npcs.filter((n) => n.locationId !== locationId));
    }
  };

  const showLocationToPlayers = (location, imageIndex = 0) => {
    const locationToSend = {
      ...location,
      selectedImageIndex: imageIndex,
    };

    sendToPlayerView({
      type: "location",
      data: locationToSend,
    });

    // Spiele Sound ab wenn vorhanden
    if (location.sound) {
      stopMusicPlayer(); // Music Player stoppen
      playSound(location.sound);
    } else {
      stopSound();
    }
  };

  // NPC Functions
  const resetNPCForm = () => {
    setNpcFormData({
      name: "",
      profession: "",
      description: "",
      images: [""],
      sound: "",
      isEnemy: false,
    });
    setIsAddingNPC(null);
    setEditingNPC(null);
  };

  const handleSaveNPC = (locationId, subLocationId = null) => {
    if (!npcFormData.name.trim() || !npcFormData.profession.trim()) {
      alert("Name und Profession sind Pflichtfelder!");
      return;
    }

    const cleanImages = npcFormData.images.filter((img) => img.trim() !== "");

    if (editingNPC) {
      setNpcs(
        npcs.map((n) =>
          n.id === editingNPC.id
            ? {
                ...npcFormData,
                images: cleanImages,
                id: editingNPC.id,
                storyId: selectedStory.id,
                locationId: subLocationId ? null : locationId,
                subLocationId: subLocationId || null,
              }
            : n,
        ),
      );
    } else {
      const newNPC = {
        ...npcFormData,
        images: cleanImages,
        id: generateId(),
        storyId: selectedStory.id,
        locationId: subLocationId ? null : locationId,
        subLocationId: subLocationId || null,
        createdAt: Date.now(),
      };
      setNpcs([...npcs, newNPC]);
    }
    resetNPCForm();
  };

  const handleEditNPC = (npc) => {
    setEditingNPC(npc);
    setNpcFormData({
      name: npc.name,
      profession: npc.profession,
      description: npc.description || "",
      images: npc.images && npc.images.length > 0 ? npc.images : [""],
      sound: npc.sound || "",
      isEnemy: npc.isEnemy || false,
    });
    if (npc.subLocationId) {
      setIsAddingNPCToSubLocation(npc.subLocationId);
      setIsAddingNPC(null);
    } else {
      setIsAddingNPC(npc.locationId);
      setIsAddingNPCToSubLocation(null);
    }
  };

  const handleDeleteNPC = (npcId) => {
    if (window.confirm("Möchtest du diesen NPC wirklich löschen?")) {
      setNpcs(npcs.filter((n) => n.id !== npcId));
    }
  };

  const showNPCToPlayers = (npc, npcImageIndex = 0, locationImageIndex = 0) => {
    // Check if NPC belongs to SubLocation or Location
    const location = npc.locationId
      ? locations.find((l) => l.id === npc.locationId)
      : null;
    const subLocation = npc.subLocationId
      ? subLocations.find((sl) => sl.id === npc.subLocationId)
      : null;

    const npcToSend = {
      ...npc,
      selectedImageIndex: npcImageIndex,
    };

    // Send SubLocation OR Location (SubLocation has priority)
    const locationToSend = subLocation
      ? {
          ...subLocation,
          selectedImageIndex: locationImageIndex,
          isSubLocation: true, // Flag to identify as SubLocation
        }
      : location
        ? {
            ...location,
            selectedImageIndex: locationImageIndex,
            isSubLocation: false,
          }
        : null;

    sendToPlayerView({
      type: "both",
      location: locationToSend,
      npc: npcToSend,
    });

    // Spiele NPC Sound ab wenn vorhanden, sonst Location/SubLocation Sound
    if (npc.sound) {
      stopMusicPlayer(); // Music Player stoppen
      playSound(npc.sound);
    } else if (subLocation?.sound) {
      stopMusicPlayer(); // Music Player stoppen
      playSound(subLocation.sound);
    } else if (location?.sound) {
      stopMusicPlayer(); // Music Player stoppen
      playSound(location.sound);
    } else {
      stopSound();
    }
  };

  // Image Field Functions
  const addLocationImageField = () => {
    setLocationFormData({
      ...locationFormData,
      images: [...locationFormData.images, ""],
    });
  };

  const updateLocationImageField = (index, value) => {
    const newImages = [...locationFormData.images];
    newImages[index] = value;
    setLocationFormData({ ...locationFormData, images: newImages });
  };

  const removeLocationImageField = (index) => {
    const newImages = locationFormData.images.filter((_, i) => i !== index);
    setLocationFormData({
      ...locationFormData,
      images: newImages.length > 0 ? newImages : [""],
    });
  };

  const addNPCImageField = () => {
    setNpcFormData({ ...npcFormData, images: [...npcFormData.images, ""] });
  };

  const updateNPCImageField = (index, value) => {
    const newImages = [...npcFormData.images];
    newImages[index] = value;
    setNpcFormData({ ...npcFormData, images: newImages });
  };

  const removeNPCImageField = (index) => {
    const newImages = npcFormData.images.filter((_, i) => i !== index);
    setNpcFormData({
      ...npcFormData,
      images: newImages.length > 0 ? newImages : [""],
    });
  };

  if (!selectedStory) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-12 shadow-2xl text-center`}
      >
        <p className={`${theme.text} text-xl opacity-70`}>
          Wähle zuerst eine Story aus, um Locations und NPCs zu verwalten.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl overflow-x-hidden w-full`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <MapPin className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-xl md:text-2xl font-bold`}>
            Locations & NPCs
          </h3>
        </div>
        <button
          onClick={() => setIsAddingLocation(true)}
          className={`${theme.button} px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold text-sm md:text-base w-full md:w-auto justify-center`}
        >
          <Plus className="w-5 h-5" /> Location hinzufügen
        </button>
      </div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setLocationFilter("all")}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
            locationFilter === "all"
              ? theme.button
              : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
          }`}
        >
          Alle ({storyLocations.length})
        </button>
        <button
          onClick={() => setLocationFilter("city")}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
            locationFilter === "city"
              ? "bg-purple-500/30 border-2 border-purple-500 text-purple-300"
              : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
          }`}
        >
          🏰 Stadt ({cityWideLocations.length})
        </button>
        <button
          onClick={() => setLocationFilter("story")}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
            locationFilter === "story"
              ? "bg-blue-500/30 border-2 border-blue-500 text-blue-300"
              : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
          }`}
        >
          📖 Story ({storySpecificLocations.length})
        </button>
      </div>

      {/* Aktuell angezeigt */}
      {(currentLocation || currentNPC) && (
        <div
          className={`${theme.border} border-2 rounded-lg p-4 mb-6 bg-purple-900/30`}
        >
          <div className={`${theme.text} text-sm font-semibold mb-2`}>
            Aktuell auf Player View:
          </div>
          {currentLocation && (
            <div className={`${theme.accent} text-lg`}>
              📍 {currentLocation.name}
            </div>
          )}
          {currentNPC && (
            <div className={`${theme.accent} text-lg`}>
              👤 {currentNPC.name}
            </div>
          )}
        </div>
      )}

      {/* Location Form */}
      {isAddingLocation && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-6 mb-6`}
        >
          <h4 className={`${theme.text} text-lg font-bold mb-4`}>
            {editingLocation ? "Location bearbeiten" : "Neue Location"}
          </h4>
          <div className="space-y-4">
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Name
              </label>
              <input
                type="text"
                value={locationFormData.name}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    name: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="z.B. Die verfluchte Taverne"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Beschreibung (für GM)
              </label>
              <textarea
                value={locationFormData.description}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    description: e.target.value,
                  })
                }
                rows={4}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Was passiert an dieser Location?"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Bilder (Landscape empfohlen)
              </label>
              {locationFormData.images.map((img, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) =>
                      updateLocationImageField(index, e.target.value)
                    }
                    className={`flex-1 px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="/images/locations/tavern-1.jpg"
                  />
                  {locationFormData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocationImageField(index)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLocationImageField}
                className={`${theme.button} px-4 py-2 rounded-lg text-sm mt-2`}
              >
                + Weiteres Bild
              </button>
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Sound/Musik (optional)
              </label>
              <input
                type="text"
                value={locationFormData.sound}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    sound: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="/music/ambient/tavern.mp3"
              />
              <p className={`${theme.text} text-xs opacity-50 mt-1`}>
                Wird automatisch abgespielt wenn Location angezeigt wird
              </p>
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Verfügbarkeit
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setLocationFormData({
                      ...locationFormData,
                      isCityWide: false,
                    })
                  }
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    !locationFormData.isCityWide
                      ? "bg-blue-500/30 border-2 border-blue-500 text-blue-300"
                      : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                  }`}
                >
                  📖 Nur diese Story
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocationFormData({
                      ...locationFormData,
                      isCityWide: true,
                    })
                  }
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    locationFormData.isCityWide
                      ? "bg-purple-500/30 border-2 border-purple-500 text-purple-300"
                      : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                  }`}
                >
                  🏰 Ganze Stadt
                </button>
              </div>
              <p className={`${theme.text} text-xs opacity-50 mt-1`}>
                {locationFormData.isCityWide
                  ? "Location erscheint in allen Storys dieser Stadt"
                  : "Location nur in dieser Story verfügbar"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveLocation}
                className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
              >
                Speichern
              </button>
              <button
                onClick={resetLocationForm}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6 w-full">
        {storyLocations
          .filter((location) => {
            if (locationFilter === "all") return true;
            if (locationFilter === "city")
              return location.cityId && !location.storyId;
            if (locationFilter === "story") return location.storyId;
            return true;
          })
          .map((location) => {
            const locationNPCs = getNPCsForLocation(location.id);
            const isExpanded = expandedLocations[location.id];

            return (
              <div
                key={location.id}
                className={`${theme.cardBg} ${theme.border} border-2 rounded-lg overflow-hidden h-full flex flex-col`}
              >
                {/* Location Header */}
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h4
                        onClick={() => toggleLocation(location.id)}
                        className={`${theme.text} text-lg font-bold mb-2 flex items-center gap-2 cursor-pointer hover:${theme.accent} transition-colors`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                        {location.name}
                        {location.cityId && !location.storyId && (
                          <span className="text-xs px-2 py-1 bg-purple-500/30 border border-purple-500 text-purple-300 rounded">
                            🏰 Stadt
                          </span>
                        )}
                      </h4>
                      <ImageSelector
                        ref={(el) =>
                          (locationImageRefs.current[location.id] = el)
                        }
                        images={location.images}
                        alt={location.name}
                        className="w-30 h-30 object-cover rounded-lg mb-2 items-center justify-center"
                        theme={theme}
                      />
                      {location.description && (
                        <div>
                          <p
                            className={`${theme.text} text-sm opacity-70 mb-2 ${
                              !expandedDescriptions[`loc-${location.id}`]
                                ? "line-clamp-2"
                                : ""
                            }`}
                          >
                            {location.description}
                          </p>
                          {location.description.length > 100 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(`loc-${location.id}`);
                              }}
                              className={`${theme.accent} text-xs flex items-center gap-1 hover:underline`}
                            >
                              {expandedDescriptions[`loc-${location.id}`] ? (
                                <>
                                  <ChevronUp className="w-3 h-3" /> Weniger
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" /> Mehr
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      <div
                        className={`${theme.text} text-xs opacity-50 mt-2 mb-3`}
                      >
                        {locationNPCs.length} NPC
                        {locationNPCs.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const imageIndex =
                              locationImageRefs.current[
                                location.id
                              ]?.getCurrentIndex() || 0;
                            showLocationToPlayers(location, imageIndex);
                          }}
                          className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2`}
                        >
                          <Eye className="w-4 h-4" /> Zeigen
                        </button>
                        <button
                          onClick={() => handleEditLocation(location)}
                          className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NPCs Section (Expanded) */}
                {isExpanded && (
                  <div className={`${theme.border} border-t-2 p-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className={`${theme.accent} w-5 h-5`} />
                        <h5 className={`${theme.text} text-lg font-semibold`}>
                          NPCs
                        </h5>
                      </div>
                      <button
                        onClick={() => setIsAddingNPC(location.id)}
                        className={`${theme.button} px-4 py-2 rounded-lg flex items-center gap-2 text-sm`}
                      >
                        <Plus className="w-4 h-4" /> NPC hinzufügen
                      </button>
                    </div>

                    {/* NPC Form */}
                    {isAddingNPC === location.id && (
                      <div
                        className={`${theme.cardBg} ${theme.border} border rounded-lg p-4 mb-4`}
                      >
                        <h6 className={`${theme.text} font-bold mb-3`}>
                          {editingNPC ? "NPC bearbeiten" : "Neuer NPC"}
                        </h6>
                        <div className="space-y-3">
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              value={npcFormData.name}
                              onChange={(e) =>
                                setNpcFormData({
                                  ...npcFormData,
                                  name: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="z.B. Hans Tunichtgut"
                            />
                          </div>
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Profession
                            </label>
                            <input
                              type="text"
                              value={npcFormData.profession}
                              onChange={(e) =>
                                setNpcFormData({
                                  ...npcFormData,
                                  profession: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="z.B. Händler"
                            />
                          </div>
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Beschreibung
                            </label>
                            <textarea
                              value={npcFormData.description}
                              onChange={(e) =>
                                setNpcFormData({
                                  ...npcFormData,
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                              className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="Was erfahren die Spieler?"
                            />
                          </div>
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Bilder (Portrait)
                            </label>
                            {npcFormData.images.map((img, index) => (
                              <div key={index} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) =>
                                    updateNPCImageField(index, e.target.value)
                                  }
                                  className={`flex-1 px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                  placeholder="/images/npcs/hans.jpg"
                                />
                                {npcFormData.images.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeNPCImageField(index)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addNPCImageField}
                              className={`${theme.button} px-3 py-1 rounded-lg text-xs`}
                            >
                              + Weiteres Bild
                            </button>
                          </div>
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Sound (optional)
                            </label>
                            <input
                              type="text"
                              value={npcFormData.sound}
                              onChange={(e) =>
                                setNpcFormData({
                                  ...npcFormData,
                                  sound: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="/music/npc/merchant.mp3"
                            />
                            <p
                              className={`${theme.text} text-xs opacity-50 mt-1`}
                            >
                              Überschreibt Location-Sound
                            </p>
                          </div>
                          <div>
                            <label
                              className={`${theme.text} block mb-1 text-sm font-semibold`}
                            >
                              Typ
                            </label>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setNpcFormData({
                                    ...npcFormData,
                                    isEnemy: false,
                                  })
                                }
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                                  !npcFormData.isEnemy
                                    ? "bg-blue-500/30 border-2 border-blue-500 text-blue-300"
                                    : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                                }`}
                              >
                                👤 Normaler NPC
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setNpcFormData({
                                    ...npcFormData,
                                    isEnemy: true,
                                  })
                                }
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                                  npcFormData.isEnemy
                                    ? "bg-red-500/30 border-2 border-red-500 text-red-300"
                                    : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                                }`}
                              >
                                ⚔️ Gegner
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveNPC(location.id)}
                              className={`${theme.button} flex-1 px-4 py-2 rounded-lg text-sm font-semibold`}
                            >
                              Speichern
                            </button>
                            <button
                              onClick={resetNPCForm}
                              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NPCs List */}
                    {locationNPCs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {locationNPCs.map((npc) => (
                          <div
                            key={npc.id}
                            className={`${theme.cardBg} ${theme.border} border rounded-lg p-3`}
                          >
                            <div className="flex gap-3 mb-3">
                              <ImageSelector
                                ref={(el) =>
                                  (npcImageRefs.current[npc.id] = el)
                                }
                                images={npc.images}
                                alt={npc.name}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                theme={theme}
                              />
                              <div className="flex-1">
                                <h6 className={`${theme.text} font-bold`}>
                                  {npc.name}
                                  {npc.isEnemy && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-red-500/30 border border-red-500 text-red-300 rounded">
                                      ⚔️ Gegner
                                    </span>
                                  )}
                                </h6>
                                <p className={`${theme.accent} text-sm`}>
                                  {npc.profession}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mb-3">
                              <button
                                onClick={() => {
                                  const npcImageIndex =
                                    npcImageRefs.current[
                                      npc.id
                                    ]?.getCurrentIndex() || 0;
                                  const locationImageIndex =
                                    locationImageRefs.current[
                                      location.id
                                    ]?.getCurrentIndex() || 0;
                                  showNPCToPlayers(
                                    npc,
                                    npcImageIndex,
                                    locationImageIndex,
                                  );
                                }}
                                className={`${theme.button} flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1`}
                              >
                                <Eye className="w-4 h-4" /> Zeigen
                              </button>
                              <button
                                onClick={() => handleEditNPC(npc)}
                                className={`${theme.button} px-3 py-2 rounded-lg`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNPC(npc.id)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {npc.description && (
                              <div>
                                <p
                                  className={`${
                                    theme.text
                                  } text-xs opacity-70 ${
                                    !expandedDescriptions[`npc-${npc.id}`]
                                      ? "line-clamp-2"
                                      : ""
                                  }`}
                                >
                                  {npc.description}
                                </p>
                                {npc.description.length > 80 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDescription(`npc-${npc.id}`);
                                    }}
                                    className={`${theme.accent} text-xs flex items-center gap-1 hover:underline mt-1`}
                                  >
                                    {expandedDescriptions[`npc-${npc.id}`] ? (
                                      <>
                                        <ChevronUp className="w-3 h-3" />{" "}
                                        Weniger
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-3 h-3" /> Mehr
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`${theme.text} text-center py-6 opacity-50 text-sm`}
                      >
                        Keine NPCs an dieser Location
                      </div>
                    )}
                    {/* SubLocations Section */}
                    <div className={`${theme.border} border-t-2 pt-4 mt-4`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Package className={`${theme.accent} w-5 h-5`} />
                          <h5 className={`${theme.text} text-lg font-semibold`}>
                            Objekte & Entdeckungen
                          </h5>
                        </div>
                        <button
                          onClick={() => setIsAddingSubLocation(location.id)}
                          className={`${theme.button} px-4 py-2 rounded-lg flex items-center gap-2 text-sm`}
                        >
                          <Plus className="w-4 h-4" /> Objekt hinzufügen
                        </button>
                      </div>

                      {/* SubLocation Form */}
                      {isAddingSubLocation === location.id && (
                        <div
                          className={`${theme.cardBg} ${theme.border} border rounded-lg p-4 mb-4`}
                        >
                          <h6 className={`${theme.text} font-bold mb-3`}>
                            {editingSubLocation
                              ? "Objekt bearbeiten"
                              : "Neues Objekt"}
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <label
                                className={`${theme.text} block mb-1 text-sm font-semibold`}
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                value={subLocationFormData.name}
                                onChange={(e) =>
                                  setSubLocationFormData({
                                    ...subLocationFormData,
                                    name: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                placeholder="z.B. Altes Tagebuch"
                              />
                            </div>
                            <div>
                              <label
                                className={`${theme.text} block mb-1 text-sm font-semibold`}
                              >
                                Beschreibung
                              </label>
                              <textarea
                                value={subLocationFormData.description}
                                onChange={(e) =>
                                  setSubLocationFormData({
                                    ...subLocationFormData,
                                    description: e.target.value,
                                  })
                                }
                                rows={2}
                                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                placeholder="Was steht darin / was finden die Spieler?"
                              />
                            </div>
                            <div>
                              <label
                                className={`${theme.text} block mb-1 text-sm font-semibold`}
                              >
                                Bild
                              </label>
                              <input
                                type="text"
                                value={subLocationFormData.image}
                                onChange={(e) =>
                                  setSubLocationFormData({
                                    ...subLocationFormData,
                                    image: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                placeholder="/images/objects/diary.jpg"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveSubLocation(location.id)
                                }
                                className={`${theme.button} flex-1 px-4 py-2 rounded-lg text-sm font-semibold`}
                              >
                                Speichern
                              </button>
                              <button
                                type="button"
                                onClick={resetSubLocationForm}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SubLocations List */}
                      {getSubLocationsForLocation(location.id).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getSubLocationsForLocation(location.id).map(
                            (subLoc) => (
                              <div
                                key={subLoc.id}
                                className={`${theme.cardBg} ${theme.border} border rounded-lg p-3`}
                              >
                                {subLoc.image && (
                                  <img
                                    src={subLoc.image}
                                    alt={subLoc.name}
                                    className="w-full h-24 object-contain bg-black/20 rounded-lg mb-2"
                                    onError={(e) =>
                                      (e.target.style.display = "none")
                                    }
                                  />
                                )}
                                <h6
                                  className={`${theme.text} font-bold text-sm`}
                                >
                                  {subLoc.name}
                                </h6>
                                {subLoc.description && (
                                  <div>
                                    <p
                                      className={`${
                                        theme.text
                                      } text-xs opacity-70 mb-2 ${
                                        !expandedDescriptions[
                                          `subloc-${subLoc.id}`
                                        ]
                                          ? "line-clamp-2"
                                          : ""
                                      }`}
                                    >
                                      {subLoc.description}
                                    </p>
                                    {subLoc.description.length > 60 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleDescription(
                                            `subloc-${subLoc.id}`,
                                          );
                                        }}
                                        className={`${theme.accent} text-xs flex items-center gap-1 hover:underline mb-2`}
                                      >
                                        {expandedDescriptions[
                                          `subloc-${subLoc.id}`
                                        ] ? (
                                          <>
                                            <ChevronUp className="w-3 h-3" />{" "}
                                            Weniger
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="w-3 h-3" />{" "}
                                            Mehr
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() =>
                                      showSubLocationToPlayers(subLoc)
                                    }
                                    className={`${theme.button} flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1`}
                                  >
                                    <Eye className="w-4 h-4" /> Zeigen
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEditSubLocation(subLoc)
                                    }
                                    className={`${theme.button} px-3 py-2 rounded-lg`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubLocation(subLoc.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* NPCs in this SubLocation */}
                                {getNPCsForSubLocation(subLoc.id).length >
                                  0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                                    <div className="flex items-center gap-1 mb-2">
                                      <Users className="w-3 h-3 text-purple-400" />
                                      <span className="text-xs text-purple-400 font-semibold">
                                        NPCs hier:
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {getNPCsForSubLocation(subLoc.id).map(
                                        (npc) => (
                                          <div
                                            key={npc.id}
                                            className="bg-black/20 rounded p-2"
                                          >
                                            <div className="flex gap-2 mb-2">
                                              {npc.images && npc.images[0] && (
                                                <img
                                                  src={npc.images[0]}
                                                  alt={npc.name}
                                                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                                                  onError={(e) =>
                                                    (e.target.style.display =
                                                      "none")
                                                  }
                                                />
                                              )}
                                              <div className="flex-1">
                                                <div
                                                  className={`${theme.text} text-xs font-semibold`}
                                                >
                                                  {npc.name}
                                                </div>
                                                <div
                                                  className={`${theme.accent} text-xs opacity-70`}
                                                >
                                                  {npc.profession}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                              <button
                                                onClick={() => {
                                                  showNPCToPlayers(npc, 0, 0);
                                                }}
                                                className={`${theme.button} flex-1 px-2 py-1 rounded text-xs flex items-center justify-center gap-1`}
                                              >
                                                <Eye className="w-3 h-3" />{" "}
                                                Zeigen
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleEditNPC(npc)
                                                }
                                                className={`${theme.button} px-2 py-1 rounded text-xs`}
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDeleteNPC(npc.id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                            {npc.description && (
                                              <div>
                                                <p
                                                  className={`${
                                                    theme.text
                                                  } text-xs opacity-70 ${
                                                    !expandedDescriptions[
                                                      `npc-subloc-${npc.id}`
                                                    ]
                                                      ? "line-clamp-2"
                                                      : ""
                                                  }`}
                                                >
                                                  {npc.description}
                                                </p>
                                                {npc.description.length >
                                                  80 && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleDescription(
                                                        `npc-subloc-${npc.id}`,
                                                      );
                                                    }}
                                                    className={`${theme.accent} text-xs flex items-center gap-1 hover:underline mt-1`}
                                                  >
                                                    {expandedDescriptions[
                                                      `npc-subloc-${npc.id}`
                                                    ] ? (
                                                      <>
                                                        <ChevronUp className="w-3 h-3" />{" "}
                                                        Weniger
                                                      </>
                                                    ) : (
                                                      <>
                                                        <ChevronDown className="w-3 h-3" />{" "}
                                                        Mehr
                                                      </>
                                                    )}
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Add NPC to SubLocation Button */}
                                <div className="mt-3 pt-3 border-t border-gray-700/50">
                                  {isAddingNPCToSubLocation !== subLoc.id ? (
                                    <button
                                      onClick={() =>
                                        setIsAddingNPCToSubLocation(subLoc.id)
                                      }
                                      className={`${theme.button} w-full px-2 py-2 rounded text-xs flex items-center justify-center gap-1`}
                                    >
                                      <Plus className="w-3 h-3" /> NPC
                                      hinzufügen
                                    </button>
                                  ) : (
                                    <div className="bg-black/30 rounded-lg p-3 space-y-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <span
                                          className={`${theme.text} text-xs font-semibold`}
                                        >
                                          NPC hinzufügen
                                        </span>
                                        <button
                                          onClick={() => {
                                            setIsAddingNPCToSubLocation(null);
                                            resetNPCForm();
                                          }}
                                          className="text-gray-400 hover:text-white text-xs"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="NPC Name *"
                                        value={npcFormData.name}
                                        onChange={(e) =>
                                          setNpcFormData({
                                            ...npcFormData,
                                            name: e.target.value,
                                          })
                                        }
                                        className={`w-full px-2 py-1 ${theme.cardBg} ${theme.border} border rounded ${theme.text} text-xs`}
                                      />
                                      <input
                                        type="text"
                                        placeholder="Beruf/Rolle *"
                                        value={npcFormData.profession}
                                        onChange={(e) =>
                                          setNpcFormData({
                                            ...npcFormData,
                                            profession: e.target.value,
                                          })
                                        }
                                        className={`w-full px-2 py-1 ${theme.cardBg} ${theme.border} border rounded ${theme.text} text-xs`}
                                      />
                                      <textarea
                                        placeholder="Beschreibung"
                                        value={npcFormData.description}
                                        onChange={(e) =>
                                          setNpcFormData({
                                            ...npcFormData,
                                            description: e.target.value,
                                          })
                                        }
                                        rows="2"
                                        className={`w-full px-2 py-1 ${theme.cardBg} ${theme.border} border rounded ${theme.text} text-xs`}
                                      />
                                      <input
                                        type="text"
                                        placeholder="Bild URL"
                                        value={npcFormData.images[0] || ""}
                                        onChange={(e) =>
                                          setNpcFormData({
                                            ...npcFormData,
                                            images: [e.target.value],
                                          })
                                        }
                                        className={`w-full px-2 py-1 ${theme.cardBg} ${theme.border} border rounded ${theme.text} text-xs`}
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            handleSaveNPC(
                                              location.id,
                                              subLoc.id,
                                            );
                                            setIsAddingNPCToSubLocation(null);
                                          }}
                                          className={`${theme.button} flex-1 px-2 py-1 rounded text-xs font-semibold`}
                                        >
                                          Speichern
                                        </button>
                                        <button
                                          onClick={() => {
                                            setIsAddingNPCToSubLocation(null);
                                            resetNPCForm();
                                          }}
                                          className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs font-semibold"
                                        >
                                          Abbrechen
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div
                          className={`${theme.text} text-center py-4 opacity-50 text-sm`}
                        >
                          Keine Objekte vorhanden
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {storyLocations.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Locations vorhanden. Erstelle deine erste Location!
        </div>
      )}
    </div>
  );
};

export default LocationWithNPCs;
