import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";

const CitySelector = ({ theme }) => {
  const { cities, setCities, selectedCity, setSelectedCity, sendToPlayerView } =
    useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [expandedCities, setExpandedCities] = useState({});
  const [newCityData, setNewCityData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const toggleCity = (cityId) => {
    setExpandedCities((prev) => ({
      ...prev,
      [cityId]: !prev[cityId],
    }));
  };

  const addCity = () => {
    if (!newCityData.name.trim()) {
      alert("Bitte gib einen Namen ein!");
      return;
    }

    const newCity = {
      id: generateId(),
      name: newCityData.name,
      description: newCityData.description,
      image: newCityData.image,
      createdAt: Date.now(),
    };

    setCities([...cities, newCity]);
    setNewCityData({ name: "", description: "", image: "" });
    setIsAdding(false);
  };

  const deleteCity = (cityId) => {
    if (
      window.confirm(
        "Möchtest du diese Stadt wirklich löschen? Alle zugehörigen Storys werden ebenfalls gelöscht!"
      )
    ) {
      setCities(cities.filter((c) => c.id !== cityId));
      if (selectedCity?.id === cityId) {
        setSelectedCity(null);
      }
    }
  };

  const updateCity = () => {
    if (!editingCity || !editingCity.name.trim()) {
      alert("Bitte gib einen Namen ein!");
      return;
    }

    setCities(cities.map((c) => (c.id === editingCity.id ? editingCity : c)));
    setEditingCity(null);
  };

  const showCityToPlayers = (city) => {
    sendToPlayerView({
      type: "city",
      data: city,
    });
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-xl font-bold`}>Städte</h3>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`${theme.button} px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105`}
        >
          <Plus className="w-4 h-4" /> Stadt hinzufügen
        </button>
      </div>

      {isAdding && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 mb-4`}
        >
          <div className="space-y-3">
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Name
              </label>
              <input
                type="text"
                value={newCityData.name}
                onChange={(e) =>
                  setNewCityData({ ...newCityData, name: e.target.value })
                }
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Stadtname..."
                autoFocus
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Beschreibung
              </label>
              <textarea
                value={newCityData.description}
                onChange={(e) =>
                  setNewCityData({
                    ...newCityData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Beschreibung der Stadt..."
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Bild
              </label>
              <input
                type="text"
                value={newCityData.image}
                onChange={(e) =>
                  setNewCityData({ ...newCityData, image: e.target.value })
                }
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="/images/cities/nexarion.jpg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCity}
                className={`${theme.button} flex-1 px-4 py-2 rounded-lg`}
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewCityData({ name: "", description: "", image: "" });
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCity && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 mb-4`}
        >
          <div className="space-y-3">
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Name
              </label>
              <input
                type="text"
                value={editingCity.name}
                onChange={(e) =>
                  setEditingCity({ ...editingCity, name: e.target.value })
                }
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                autoFocus
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Beschreibung
              </label>
              <textarea
                value={editingCity.description || ""}
                onChange={(e) =>
                  setEditingCity({
                    ...editingCity,
                    description: e.target.value,
                  })
                }
                rows={3}
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Bild
              </label>
              <input
                type="text"
                value={editingCity.image || ""}
                onChange={(e) =>
                  setEditingCity({ ...editingCity, image: e.target.value })
                }
                className={`w-full px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={updateCity}
                className={`${theme.button} flex-1 px-4 py-2 rounded-lg`}
              >
                Speichern
              </button>
              <button
                onClick={() => setEditingCity(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cities.map((city) => {
          const isExpanded = expandedCities[city.id];

          return (
            <div
              key={city.id}
              className={`${theme.cardBg} ${
                theme.border
              } border-2 rounded-lg overflow-hidden transition-all hover:shadow-xl ${
                selectedCity?.id === city.id ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex items-start gap-2 flex-1"
                    onClick={() => setSelectedCity(city)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCity(city.id);
                      }}
                      className={`${theme.text} hover:${theme.accent} transition-colors flex-shrink-0`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {/* Thumbnail wenn zugeklappt */}
                    {!isExpanded && city.image && (
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}

                    <div className="flex-1 cursor-pointer min-w-0">
                      <span className={`${theme.text} font-semibold text-lg`}>
                        {city.name}
                      </span>
                      {city.description && !isExpanded && (
                        <p
                          className={`${theme.text} text-xs opacity-50 line-clamp-1 mt-1`}
                        >
                          {city.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showCityToPlayers(city);
                      }}
                      className={`${theme.button} p-2 rounded-lg transition-all hover:scale-110`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCity(city);
                      }}
                      className={`${theme.button} p-2 rounded-lg transition-all hover:scale-110`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCity(city.id);
                      }}
                      className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    {city.image && (
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    {city.description && (
                      <p className={`${theme.text} text-sm opacity-70`}>
                        {city.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cities.length === 0 && (
        <div className={`${theme.text} text-center py-8 opacity-50`}>
          Noch keine Städte vorhanden. Erstelle deine erste Stadt!
        </div>
      )}
    </div>
  );
};

export default CitySelector;
