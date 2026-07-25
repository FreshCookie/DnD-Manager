import React from "react";

export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="px-1">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-0 sm:flex-none px-2 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-base whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id
                  ? "text-amber-400 border-amber-500 bg-gray-900/50"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                <span className="text-[10px] sm:text-base leading-tight">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
