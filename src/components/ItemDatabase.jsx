import React, { useState } from "react";
import { Sword, Shield, Package, Plus, Trash2, Edit } from "lucide-react";

const ItemDatabase = () => {
  const [activeTab, setActiveTab] = useState("weapons"); // weapons, armor, items
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [items, setItems] = useState({
    weapons: [
      {
        id: 1,
        name: "Eisenschwert",
        damage: 10,
        type: "Einhand",
        rarity: "Common",
      },
      {
        id: 2,
        name: "Kriegshammer",
        damage: 15,
        type: "Zweihand",
        rarity: "Uncommon",
      },
    ],
    armor: [
      {
        id: 1,
        name: "Lederrüstung",
        defense: 5,
        type: "Leicht",
        rarity: "Common",
      },
      {
        id: 2,
        name: "Plattenrüstung",
        defense: 20,
        type: "Schwer",
        rarity: "Rare",
      },
    ],
    items: [
      {
        id: 1,
        name: "Heiltrank",
        effect: "Heilt 50 HP",
        stackable: true,
        rarity: "Common",
      },
      {
        id: 2,
        name: "Ausdauertrank",
        effect: "Regeneriert 30 Stamina",
        stackable: true,
        rarity: "Common",
      },
    ],
  });

  const rarityColors = {
    Common: "text-gray-400 border-gray-500",
    Uncommon: "text-green-400 border-green-500",
    Rare: "text-blue-400 border-blue-500",
    Epic: "text-purple-400 border-purple-500",
    Legendary: "text-yellow-400 border-yellow-500",
  };

  const deleteItem = (category, id) => {
    setItems({
      ...items,
      [category]: items[category].filter((item) => item.id !== id),
    });
  };

  return (
    <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-purple-400" />
        Item Datenbank
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("weapons")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "weapons"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Sword className="w-4 h-4" />
          Waffen
        </button>
        <button
          onClick={() => setActiveTab("armor")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "armor"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Shield className="w-4 h-4" />
          Rüstungen
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "items"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Package className="w-4 h-4" />
          Items
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Neues Item hinzufügen
      </button>

      {/* Item Liste */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {items[activeTab].map((item) => (
          <div
            key={item.id}
            className={`bg-gray-700 rounded-lg p-3 border-2 ${
              rarityColors[item.rarity]
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-xs text-gray-400 space-y-1 mt-1">
                  {activeTab === "weapons" && (
                    <>
                      <div>Schaden: {item.damage}</div>
                      <div>Typ: {item.type}</div>
                    </>
                  )}
                  {activeTab === "armor" && (
                    <>
                      <div>Verteidigung: {item.defense}</div>
                      <div>Typ: {item.type}</div>
                    </>
                  )}
                  {activeTab === "items" && (
                    <>
                      <div>Effekt: {item.effect}</div>
                      <div>Stapelbar: {item.stackable ? "Ja" : "Nein"}</div>
                    </>
                  )}
                  <div className={rarityColors[item.rarity]}>{item.rarity}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => deleteItem(activeTab, item.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDatabase;
