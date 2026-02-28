import React, { useState } from "react";
import { Package, Plus, Edit, Trash2, Eye, List } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";
import ImageSelector from "./ImageSelector";

const ItemManager = ({ theme }) => {
  const { items, setItems, selectedStory, sendToPlayerView } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    positiveStats: "",
    negativeStats: "",
    image: "",
    category: "weapon",
  });

  const categories = {
    weapon: { name: "Waffe", icon: "⚔️", color: "red" },
    armor: { name: "Rüstung", icon: "🛡️", color: "blue" },
    accessory: { name: "Accessoire", icon: "💍", color: "purple" },
    potion: { name: "Trank", icon: "🧪", color: "green" },
    quest: { name: "Quest Item", icon: "🔑", color: "amber" },
    misc: { name: "Sonstiges", icon: "📦", color: "gray" },
  };

  const storyItems = items.filter((i) => i.storyId === selectedStory?.id);
  const displayItems = showAllItems ? items : storyItems;

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      positiveStats: "",
      negativeStats: "",
      image: "",
      category: "weapon",
    });
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name ist ein Pflichtfeld!");
      return;
    }

    if (editingItem) {
      setItems(
        items.map((i) =>
          i.id === editingItem.id
            ? {
                ...formData,
                id: editingItem.id,
                storyId: selectedStory?.id || editingItem.storyId,
              }
            : i,
        ),
      );
    } else {
      const newItem = {
        ...formData,
        id: generateId(),
        storyId: selectedStory?.id || null,
        createdAt: Date.now(),
      };
      setItems([...items, newItem]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      positiveStats: item.positiveStats || "",
      negativeStats: item.negativeStats || "",
      image: item.image || "",
      category: item.category || "weapon",
    });
    setIsAdding(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm("Möchtest du dieses Item wirklich löschen?")) {
      setItems(items.filter((i) => i.id !== itemId));
    }
  };

  const showToPlayers = (item) => {
    sendToPlayerView({
      type: "item",
      data: item,
    });
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl overflow-x-hidden w-full`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <Package className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-xl md:text-2xl font-bold`}>
            Items
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAllItems(!showAllItems)}
            className={`${
              showAllItems
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            } px-4 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold text-sm md:text-base flex-1 md:flex-initial justify-center`}
          >
            <List className="w-5 h-5" /> Alle Items
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className={`${theme.button} px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold text-sm md:text-base flex-1 md:flex-initial justify-center`}
          >
            <Plus className="w-5 h-5" /> Item hinzufügen
          </button>
        </div>
      </div>
      {/* Kategorie-Filter */}
      <div className="mb-4">
        <div className={`${theme.text} text-sm md:text-sm font-semibold mb-2`}>
          Kategorie Filter:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              categoryFilter === "all"
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
            }`}
          >
            Alle
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                categoryFilter === key
                  ? `bg-${cat.color}-500/30 border-2 border-${cat.color}-500 text-${cat.color}-300`
                  : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
              }`}
            >
              {cat.icon} <span className="hidden sm:inline">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {isAdding && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-6 mb-6`}
        >
          <h4 className={`${theme.text} text-lg font-bold mb-4`}>
            {editingItem ? "Item bearbeiten" : "Neues Item"}
          </h4>
          <div className="space-y-4">
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="z.B. Schwert des Lichts"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Beschreibung des Items..."
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Kategorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={`${theme.text} block mb-2 font-semibold`}>
                  Positive Stats
                </label>
                <textarea
                  value={formData.positiveStats}
                  onChange={(e) =>
                    setFormData({ ...formData, positiveStats: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="+10 Angriff, +5 Verteidigung"
                />
              </div>
              <div>
                <label className={`${theme.text} block mb-2 font-semibold`}>
                  Negative Stats
                </label>
                <textarea
                  value={formData.negativeStats}
                  onChange={(e) =>
                    setFormData({ ...formData, negativeStats: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="-2 Geschwindigkeit"
                />
              </div>
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Bild Pfad
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="/images/items/sword.jpg"
              />
              <p className={`${theme.text} text-xs opacity-50 mt-1`}>
                Tipp: Verwende quadratische Bilder für Karten
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
              >
                Speichern
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 md:gap-4 w-full">
        {displayItems
          .filter(
            (item) =>
              categoryFilter === "all" || item.category === categoryFilter,
          )
          .map((item) => (
            <div
              key={item.id}
              className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 group hover:shadow-xl transition-all`}
            >
              <ImageSelector
                images={item.image ? [item.image] : []}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
                theme={theme}
              />
              {item.category && categories[item.category] && (
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-${
                    categories[item.category].color
                  }-500/30 border border-${
                    categories[item.category].color
                  }-500 text-${categories[item.category].color}-300`}
                >
                  {categories[item.category].icon}{" "}
                  {categories[item.category].name}
                </div>
              )}
              <h4 className={`${theme.text} text-lg font-bold mb-2`}>
                {item.name}
              </h4>
              {item.description && (
                <p
                  className={`${theme.text} text-sm opacity-70 mb-3 line-clamp-2`}
                >
                  {item.description}
                </p>
              )}
              {item.positiveStats && (
                <div className="mb-2">
                  <span className="text-green-400 text-sm font-semibold">
                    ✓{" "}
                  </span>
                  <span className={`${theme.text} text-sm`}>
                    {item.positiveStats}
                  </span>
                </div>
              )}
              {item.negativeStats && (
                <div className="mb-3">
                  <span className="text-red-400 text-sm font-semibold">✗ </span>
                  <span className={`${theme.text} text-sm`}>
                    {item.negativeStats}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => showToPlayers(item)}
                  className={`${theme.button} flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2`}
                >
                  <Eye className="w-4 h-4" /> Zeigen
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {displayItems.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          {showAllItems
            ? "Noch keine Items vorhanden."
            : "Noch keine Items für diese Story vorhanden."}{" "}
          Erstelle dein erstes Item!
        </div>
      )}
    </div>
  );
};

export default ItemManager;
