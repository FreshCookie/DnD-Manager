import React from "react";
import {
  X,
  User,
  Heart,
  BookOpen,
  Package,
  Shield,
  Sword,
  TrendingUp,
} from "lucide-react";

const PlayerDetailsModal = ({ isOpen, onClose, player, companion, theme }) => {
  if (!isOpen || !player) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 flex items-center justify-between border-b border-purple-500/30">
            <div className="flex items-center gap-4">
              <User className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-3xl font-bold text-white">{player.name}</h2>
                <p className="text-purple-200 text-sm">Charakter Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Image & Basic Info */}
              <div className="space-y-6">
                {/* Character Image */}
                {player.image && (
                  <div className="relative">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-80 object-contain bg-black/20 rounded-xl border-2 border-purple-500/30"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sword className={`${theme.accent} w-5 h-5`} />
                      <span className={`${theme.text} text-sm opacity-70`}>
                        Klasse
                      </span>
                    </div>
                    <p className={`${theme.text} text-lg font-bold`}>
                      {player.class || "Nicht festgelegt"}
                    </p>
                  </div>

                  <div
                    className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className={`${theme.accent} w-5 h-5`} />
                      <span className={`${theme.text} text-sm opacity-70`}>
                        Rasse
                      </span>
                    </div>
                    <p className={`${theme.text} text-lg font-bold`}>
                      {player.race || "Nicht festgelegt"}
                    </p>
                  </div>

                  <div
                    className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`${theme.accent} w-5 h-5`} />
                      <span className={`${theme.text} text-sm opacity-70`}>
                        Level
                      </span>
                    </div>
                    <p className={`${theme.text} text-lg font-bold`}>
                      {player.level || "1"}
                    </p>
                  </div>

                  <div
                    className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className={`${theme.accent} w-5 h-5`} />
                      <span className={`${theme.text} text-sm opacity-70`}>
                        HP
                      </span>
                    </div>
                    <p className={`${theme.text} text-lg font-bold`}>
                      {player.hp || player.maxHp || "10"} /{" "}
                      {player.maxHp || "10"}
                    </p>
                  </div>
                </div>

                {/* Alignment */}
                {player.alignment && (
                  <div
                    className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={`${theme.accent} w-5 h-5`} />
                      <span className={`${theme.text} text-sm opacity-70`}>
                        Alignment
                      </span>
                    </div>
                    <p className={`${theme.text} text-lg font-bold`}>
                      {player.alignment}
                    </p>
                  </div>
                )}

                {/* Companion */}
                {companion && (
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className={`${theme.accent} w-5 h-5`} />
                      <h4 className={`${theme.text} font-bold text-lg`}>
                        Companion
                      </h4>
                    </div>
                    <p className={`${theme.text} text-xl font-semibold mb-2`}>
                      {companion.name}
                    </p>
                    {companion.ability && (
                      <p className={`${theme.text} text-sm opacity-70`}>
                        {companion.ability}
                      </p>
                    )}
                    {companion.description && (
                      <p className={`${theme.text} text-sm opacity-70 mt-2`}>
                        {companion.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Background Story */}
                <div
                  className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className={`${theme.accent} w-5 h-5`} />
                    <h4 className={`${theme.text} font-bold text-lg`}>
                      Hintergrundgeschichte
                    </h4>
                  </div>
                  <p
                    className={`${theme.text} text-sm leading-relaxed whitespace-pre-wrap`}
                  >
                    {player.background ||
                      player.description ||
                      "Keine Hintergrundgeschichte vorhanden."}
                  </p>
                </div>

                {/* Notes Section (Placeholder) */}
                <div
                  className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className={`${theme.accent} w-5 h-5`} />
                    <h4 className={`${theme.text} font-bold text-lg`}>
                      Notizen
                    </h4>
                  </div>
                  <div className="text-center py-8">
                    <BookOpen
                      className={`${theme.text} w-12 h-12 mx-auto mb-3 opacity-30`}
                    />
                    <p className={`${theme.text} text-sm opacity-50`}>
                      Notizen-System wird in Phase 4 implementiert
                    </p>
                  </div>
                </div>

                {/* Inventory Section (Placeholder) */}
                <div
                  className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Package className={`${theme.accent} w-5 h-5`} />
                    <h4 className={`${theme.text} font-bold text-lg`}>
                      Inventar
                    </h4>
                  </div>
                  <div className="text-center py-8">
                    <Package
                      className={`${theme.text} w-12 h-12 mx-auto mb-3 opacity-30`}
                    />
                    <p className={`${theme.text} text-sm opacity-50`}>
                      Inventar-System wird in Phase 5 implementiert
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`${theme.cardBg} border-t ${theme.border} p-4 flex justify-end`}
          >
            <button
              onClick={onClose}
              className={`${theme.button} px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetailsModal;
