import React, { useState, useEffect } from "react";
import { Book, Search, Eye, Filter, X } from "lucide-react";
import { useData } from "../contexts/DataContext";

const KinksReferenceLibrary = ({ theme }) => {
  const { sendToPlayerView } = useData();
  const [referenceData, setReferenceData] = useState({
    kinks: [],
    classes: [],
    races: [],
    creatures: [],
    mechanics: [],
  });
  const [activeCategory, setActiveCategory] = useState("kinks");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState({
    kinks: [],
    classes: [],
    races: [],
    creatures: [],
    mechanics: [],
  });

  // Lade Referenzdaten
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const response = await fetch("/src/data/reference-data.json");
        const data = await response.json();
        setReferenceData(data);
      } catch (error) {
        console.error("Fehler beim Laden der Referenzdaten:", error);
      }
    };
    loadReferenceData();
  }, []);

  const categories = [
    { key: "kinks", label: "Kinks", icon: "🔗" },
    { key: "classes", label: "Klassen", icon: "⚔️" },
    { key: "races", label: "Rassen", icon: "🧝" },
    { key: "creatures", label: "Kreaturen", icon: "🐉" },
    { key: "mechanics", label: "Mechaniken", icon: "⚙️" },
  ];

  const getCurrentData = () => {
    const data = referenceData[activeCategory] || [];
    if (!searchTerm) return data;

    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const showToPlayers = (item) => {
    sendToPlayerView({
      type: "kinksReference",
      category: activeCategory,
      data: item,
    });
  };

  const toggleSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].includes(itemId)
        ? prev[activeCategory].filter((id) => id !== itemId)
        : [...prev[activeCategory], itemId],
    }));
  };

  const isSelected = (itemId) => {
    return selectedItems[activeCategory].includes(itemId);
  };

  const clearSelections = () => {
    setSelectedItems((prev) => ({
      ...prev,
      [activeCategory]: [],
    }));
  };

  const renderKinkCard = (kink) => (
    <div
      key={kink.id}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
        isSelected(kink.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`${theme.accent} text-xs font-semibold uppercase tracking-wide`}
          >
            {kink.category}
          </span>
          <h4 className={`${theme.text} text-lg font-bold mt-1`}>
            {kink.name}
          </h4>
        </div>
        <input
          type="checkbox"
          checked={isSelected(kink.id)}
          onChange={() => toggleSelection(kink.id)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <p className={`${theme.text} text-sm opacity-80 mb-3`}>
        {kink.shortDescription}
      </p>

      {kink.mechanicsSummary && (
        <div className="mb-3 p-2 bg-purple-900/30 rounded">
          <span className={`${theme.accent} text-xs font-semibold`}>
            🎲 Mechanik:
          </span>
          <p className={`${theme.text} text-xs mt-1`}>
            {kink.mechanicsSummary}
          </p>
        </div>
      )}

      {kink.examples && (
        <p className={`${theme.text} text-xs opacity-60 mb-3`}>
          <strong>Beispiele:</strong> {kink.examples}
        </p>
      )}

      <button
        onClick={() => showToPlayers(kink)}
        className={`${theme.button} w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 font-semibold text-sm`}
      >
        <Eye className="w-4 h-4" /> Auf Player View
      </button>
    </div>
  );

  const renderClassCard = (classData) => (
    <div
      key={classData.id}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
        isSelected(classData.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`${theme.accent} text-xs font-semibold uppercase tracking-wide`}
          >
            {classData.baseClass} - {classData.source}
          </span>
          <h4 className={`${theme.text} text-lg font-bold mt-1`}>
            {classData.name}
          </h4>
        </div>
        <input
          type="checkbox"
          checked={isSelected(classData.id)}
          onChange={() => toggleSelection(classData.id)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <p className={`${theme.text} text-sm opacity-80 mb-3`}>
        {classData.shortDescription}
      </p>

      <div className="mb-3 p-2 bg-blue-900/30 rounded">
        <span className={`${theme.accent} text-xs font-semibold`}>
          ⭐ Features:
        </span>
        <p className={`${theme.text} text-xs mt-1`}>{classData.keyFeatures}</p>
      </div>

      <p className={`${theme.text} text-xs opacity-60 mb-3`}>
        <strong>Spielstil:</strong> {classData.playstyle}
      </p>

      <button
        onClick={() => showToPlayers(classData)}
        className={`${theme.button} w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 font-semibold text-sm`}
      >
        <Eye className="w-4 h-4" /> Auf Player View
      </button>
    </div>
  );

  const renderRaceCard = (race) => (
    <div
      key={race.id}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
        isSelected(race.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`${theme.accent} text-xs font-semibold uppercase tracking-wide`}
          >
            {race.type} - {race.source}
          </span>
          <h4 className={`${theme.text} text-lg font-bold mt-1`}>
            {race.name}
          </h4>
        </div>
        <input
          type="checkbox"
          checked={isSelected(race.id)}
          onChange={() => toggleSelection(race.id)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <p className={`${theme.text} text-sm opacity-80 mb-3`}>
        {race.shortDescription}
      </p>

      <div className="mb-3 p-2 bg-green-900/30 rounded">
        <span className={`${theme.accent} text-xs font-semibold`}>
          🎯 Traits:
        </span>
        <p className={`${theme.text} text-xs mt-1`}>{race.traits}</p>
      </div>

      {race.culturalNotes && (
        <p className={`${theme.text} text-xs opacity-60 mb-3`}>
          <strong>Kultur:</strong> {race.culturalNotes}
        </p>
      )}

      <button
        onClick={() => showToPlayers(race)}
        className={`${theme.button} w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 font-semibold text-sm`}
      >
        <Eye className="w-4 h-4" /> Auf Player View
      </button>
    </div>
  );

  const renderCreatureCard = (creature) => (
    <div
      key={creature.id}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
        isSelected(creature.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`${theme.accent} text-xs font-semibold uppercase tracking-wide`}
          >
            {creature.type} - CR {creature.cr}
          </span>
          <h4 className={`${theme.text} text-lg font-bold mt-1`}>
            {creature.name}
          </h4>
        </div>
        <input
          type="checkbox"
          checked={isSelected(creature.id)}
          onChange={() => toggleSelection(creature.id)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <p className={`${theme.text} text-sm opacity-80 mb-3`}>
        {creature.shortDescription}
      </p>

      <div className="mb-3 p-2 bg-red-900/30 rounded">
        <span className={`${theme.accent} text-xs font-semibold`}>
          ⚔️ Taktik:
        </span>
        <p className={`${theme.text} text-xs mt-1`}>{creature.tactics}</p>
      </div>

      {creature.loot && (
        <p className={`${theme.text} text-xs opacity-60 mb-3`}>
          <strong>Beute:</strong> {creature.loot}
        </p>
      )}

      <button
        onClick={() => showToPlayers(creature)}
        className={`${theme.button} w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 font-semibold text-sm`}
      >
        <Eye className="w-4 h-4" /> Auf Player View
      </button>
    </div>
  );

  const renderMechanicCard = (mechanic) => (
    <div
      key={mechanic.id}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all ${
        isSelected(mechanic.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`${theme.accent} text-xs font-semibold uppercase tracking-wide`}
          >
            {mechanic.category}
          </span>
          <h4 className={`${theme.text} text-lg font-bold mt-1`}>
            {mechanic.name}
          </h4>
        </div>
        <input
          type="checkbox"
          checked={isSelected(mechanic.id)}
          onChange={() => toggleSelection(mechanic.id)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <p className={`${theme.text} text-sm opacity-80 mb-3`}>
        {mechanic.shortDescription}
      </p>

      <div className="mb-3 p-2 bg-yellow-900/30 rounded">
        <span className={`${theme.accent} text-xs font-semibold`}>
          📖 Details:
        </span>
        <p className={`${theme.text} text-xs mt-1`}>{mechanic.details}</p>
      </div>

      {mechanic.rules && (
        <p className={`${theme.text} text-xs opacity-60 mb-3`}>
          <strong>Regeln:</strong> {mechanic.rules}
        </p>
      )}

      <button
        onClick={() => showToPlayers(mechanic)}
        className={`${theme.button} w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 font-semibold text-sm`}
      >
        <Eye className="w-4 h-4" /> Auf Player View
      </button>
    </div>
  );

  const renderCard = (item) => {
    switch (activeCategory) {
      case "kinks":
        return renderKinkCard(item);
      case "classes":
        return renderClassCard(item);
      case "races":
        return renderRaceCard(item);
      case "creatures":
        return renderCreatureCard(item);
      case "mechanics":
        return renderMechanicCard(item);
      default:
        return null;
    }
  };

  const currentData = getCurrentData();
  const selectedCount = selectedItems[activeCategory].length;

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Book className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-2xl font-bold`}>
            K&C Referenz-Bibliothek
          </h3>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className={`${theme.accent} font-semibold`}>
              {selectedCount} ausgewählt
            </span>
            <button
              onClick={clearSelections}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
            >
              <X className="w-4 h-4" /> Auswahl aufheben
            </button>
          </div>
        )}
      </div>

      {/* Kategorie-Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
              activeCategory === cat.key
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Suchfeld */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} w-5 h-5`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${categories.find((c) => c.key === activeCategory)?.label} durchsuchen...`}
            className={`w-full pl-12 pr-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentData.length > 0 ? (
          currentData.map((item) => renderCard(item))
        ) : (
          <div
            className={`col-span-full text-center py-12 ${theme.text} opacity-50`}
          >
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Keine Einträge gefunden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KinksReferenceLibrary;
