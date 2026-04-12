import React from "react";
import { BookOpen, Hexagon, Heart, LogOut } from "lucide-react";

const StartScreen = ({ onModeSelect, onLogout, user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Logout Button (Top Right) */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300 hover:text-red-100 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">{user?.username || "Logout"}</span>
        </button>
      )}

      <div className="max-w-6xl w-full">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            D&D Session Manager
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Wähle deinen Session-Modus
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Pen & Paper Mode */}
          <button
            onClick={() => onModeSelect("penandpaper")}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:border-purple-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-purple-500/20 p-4 sm:p-6 rounded-full group-hover:bg-purple-500/30 transition-colors">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">
                Pen & Paper
              </h2>

              <p className="text-gray-300 text-sm sm:text-base text-center mb-4 sm:mb-6">
                Klassischer Session Manager für traditionelle D&D Kampagnen
              </p>

              <ul className="text-gray-400 text-xs sm:text-sm space-y-2">
                <li>✓ Story & Location Management</li>
                <li>✓ NPC & Item Verwaltung</li>
                <li>✓ Musik & Sound System</li>
                <li>✓ Player View Display</li>
              </ul>
            </div>
          </button>

          {/* Hexagon Story Mode */}
          <button
            onClick={() => onModeSelect("hexagon")}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-pink-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 hover:border-pink-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-pink-500/20 p-4 sm:p-6 rounded-full group-hover:bg-pink-500/30 transition-colors">
                  <Hexagon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">
                Hexagon Story
              </h2>

              <p className="text-gray-300 text-sm sm:text-base text-center mb-4 sm:mb-6">
                Hexagon-basiertes Story Management System für komplexe Welten
              </p>

              <ul className="text-gray-400 text-xs sm:text-sm space-y-2">
                <li>✓ Hexagon Grid System</li>
                <li>✓ Story Verzweigungen</li>
                <li>✓ Weltenkarten-Ansicht</li>
                <li>✓ Event Management</li>
              </ul>
            </div>
          </button>

          {/* Pen & Paper 18+ Mode */}
          <button
            onClick={() => onModeSelect("penandpaper18")}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-red-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 hover:border-red-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-red-500/20 p-4 sm:p-6 rounded-full group-hover:bg-red-500/30 transition-colors">
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">
                Pen & Paper 18+
              </h2>

              <p className="text-gray-300 text-sm sm:text-base text-center mb-4 sm:mb-6">
                Erweiterter Session Manager mit Kinks & Cantrips
                Referenz-Bibliothek
              </p>

              <ul className="text-gray-400 text-xs sm:text-sm space-y-2">
                <li>✓ Alle Standard Features</li>
                <li>✓ K&C Referenz-Bibliothek</li>
                <li>✓ Kinks, Klassen & Rassen</li>
                <li>✓ Kreaturen & Mechaniken</li>
              </ul>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm">
          <p>Drücke ESC um zurück zu dieser Auswahl zu kommen</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
