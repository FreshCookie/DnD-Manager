import React, { useState } from "react";
import { X, User, Edit, BookOpen, Package } from "lucide-react";

const PlayerSideMenu = ({ isOpen, onClose, character, characterData }) => {
  const [activeTab, setActiveTab] = useState("character");

  if (!isOpen) return null;

  const tabs = [
    { id: "character", label: "Mein Charakter", icon: User },
    { id: "edit", label: "Bearbeiten", icon: Edit },
    { id: "notes", label: "Notizen", icon: BookOpen },
    { id: "inventory", label: "Inventar", icon: Package },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/30 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Spieler Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Schließen"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-500/30 bg-gray-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-600/30 text-purple-300 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-6">
          {/* Mein Charakter Tab */}
          {activeTab === "character" && (
            <div className="space-y-6">
              {characterData ? (
                <>
                  {/* Character Image */}
                  {characterData.image && (
                    <div className="flex justify-center">
                      <img
                        src={characterData.image}
                        alt={characterData.name}
                        className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Character Name */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {characterData.name}
                    </h3>
                    {characterData.class && (
                      <p className="text-xl text-purple-300">
                        {characterData.class}
                        {characterData.race && ` • ${characterData.race}`}
                      </p>
                    )}
                  </div>

                  {/* Character Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {characterData.level && (
                      <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Level</div>
                        <div className="text-2xl font-bold text-white">
                          {characterData.level}
                        </div>
                      </div>
                    )}
                    {characterData.hp !== undefined && (
                      <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">HP</div>
                        <div className="text-2xl font-bold text-red-400">
                          {characterData.hp}
                          {characterData.maxHp && `/${characterData.maxHp}`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Story */}
                  {characterData.background && (
                    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-purple-300 mb-3">
                        Background Story
                      </h4>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {characterData.background}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  {characterData.alignment && (
                    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">
                        Alignment
                      </div>
                      <div className="text-lg text-white">
                        {characterData.alignment}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Kein Charakter ausgewählt</p>
                </div>
              )}
            </div>
          )}

          {/* Bearbeiten Tab */}
          {activeTab === "edit" && (
            <div className="text-center text-gray-400 py-12">
              <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Charakter Bearbeitung</p>
              <p className="text-sm">
                Wird in Phase 2 implementiert
              </p>
            </div>
          )}

          {/* Notizen Tab */}
          {activeTab === "notes" && (
            <div className="text-center text-gray-400 py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Meine Notizen</p>
              <p className="text-sm">
                Wird in Phase 2 implementiert
              </p>
            </div>
          )}

          {/* Inventar Tab */}
          {activeTab === "inventory" && (
            <div className="text-center text-gray-400 py-12">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Mein Inventar</p>
              <p className="text-sm">
                Wird in Phase 4 implementiert
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerSideMenu;
