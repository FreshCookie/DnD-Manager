import React from "react";

export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 font-semibold text-lg whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id
                  ? "text-amber-400 border-amber-500 bg-gray-900/50"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
