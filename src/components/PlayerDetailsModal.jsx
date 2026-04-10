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
  Calendar,
  Coins,
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

                {/* Notes Section */}
                <div
                  className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className={`${theme.accent} w-5 h-5`} />
                    <h4 className={`${theme.text} font-bold text-lg`}>
                      Notizen
                    </h4>
                  </div>
                  {player.notes && player.notes.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {player.notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className={`${theme.text} font-semibold`}>
                              {note.title}
                            </h5>
                            <span className="text-xs px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded">
                              {note.category || "Allgemein"}
                            </span>
                          </div>
                          {note.content && (
                            <p
                              className={`${theme.text} text-sm opacity-80 mb-2 whitespace-pre-wrap`}
                            >
                              {note.content}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs opacity-60">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(note.createdAt).toLocaleDateString(
                                "de-DE",
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen
                        className={`${theme.text} w-12 h-12 mx-auto mb-3 opacity-30`}
                      />
                      <p className={`${theme.text} text-sm opacity-50`}>
                        Keine Notizen vorhanden
                      </p>
                    </div>
                  )}
                </div>

                {/* Inventory Section */}
                <div
                  className={`${theme.cardBg} ${theme.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Package className={`${theme.accent} w-5 h-5`} />
                    <h4 className={`${theme.text} font-bold text-lg`}>
                      Inventar
                    </h4>
                  </div>
                  {player.inventory ? (
                    <div className="space-y-4">
                      {/* Currency */}
                      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg p-3 border border-yellow-700/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <h5 className={`${theme.text} font-semibold text-sm`}>
                            Währung
                          </h5>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div>
                            <div className="text-xs opacity-60">Platin</div>
                            <div className="font-bold text-purple-300">
                              {player.inventory.currency?.platinum || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-60">Gold</div>
                            <div className="font-bold text-yellow-400">
                              {player.inventory.currency?.gold || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-60">Silber</div>
                            <div className="font-bold text-gray-300">
                              {player.inventory.currency?.silver || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-60">Kupfer</div>
                            <div className="font-bold text-orange-400">
                              {player.inventory.currency?.copper || 0}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-yellow-700/20 text-center">
                          <div className="text-xs opacity-60">Gesamtwert</div>
                          <div className="font-bold text-yellow-400">
                            {(
                              (player.inventory.currency?.platinum || 0) * 10 +
                              (player.inventory.currency?.gold || 0) +
                              (player.inventory.currency?.silver || 0) / 10 +
                              (player.inventory.currency?.copper || 0) / 100
                            ).toFixed(2)}{" "}
                            GP
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      {player.inventory.items &&
                      player.inventory.items.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {player.inventory.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-gray-800/50 rounded-lg p-2 border border-gray-700 flex gap-2"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-contain bg-black/20 rounded border border-gray-700"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/48x48?text=Item";
                                  }}
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span
                                    className={`${theme.text} font-semibold text-sm`}
                                  >
                                    {item.name}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-xs px-2 py-0.5 bg-purple-900/50 border border-purple-500/30 rounded">
                                      x{item.quantity}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p
                                    className={`${theme.text} text-xs opacity-70`}
                                  >
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Package
                            className={`${theme.text} w-8 h-8 mx-auto mb-2 opacity-30`}
                          />
                          <p className={`${theme.text} text-xs opacity-50`}>
                            Keine Gegenstände
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package
                        className={`${theme.text} w-12 h-12 mx-auto mb-3 opacity-30`}
                      />
                      <p className={`${theme.text} text-sm opacity-50`}>
                        Kein Inventar vorhanden
                      </p>
                    </div>
                  )}
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
