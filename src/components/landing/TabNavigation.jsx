import React from "react";

export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-amber-500/10 sticky top-0 z-40">
      <div className="flex justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto px-2 sm:px-4 py-2.5 sm:py-3 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/40"
                : "text-gray-400 hover:text-amber-300 hover:bg-gray-800/60"
            }`}
          >
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
