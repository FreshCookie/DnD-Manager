import React, { useState } from "react";
import { Sword, Check } from "lucide-react";

const CharacterSelector = ({ characters, onSelectCharacter }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinSession = async () => {
    if (!selectedChar) return;

    setIsLoading(true);
    await onSelectCharacter(selectedChar);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Wähle deinen Charakter
          </h1>
          <p className="text-gray-300 text-lg">
            Mit welchem Charakter möchtest du spielen?
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char.id)}
              className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 ${
                selectedChar === char.id
                  ? "border-4 border-purple-500 ring-4 ring-purple-500/50"
                  : "border-2 border-gray-700 hover:border-purple-400"
              }`}
            >
              {/* Selected Indicator */}
              {selectedChar === char.id && (
                <div className="absolute -top-3 -right-3 bg-purple-600 rounded-full p-2 shadow-lg">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}

              {/* Character Image */}
              {char.image && (
                <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-character.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
              )}

              {/* Character Name */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {char.name}
                </h3>
                {char.class && (
                  <p className="text-purple-400 text-sm font-semibold">
                    {char.class}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Join Session Button */}
        <div className="text-center">
          <button
            onClick={handleJoinSession}
            disabled={!selectedChar || isLoading}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
              !selectedChar || isLoading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-xl"
            }`}
          >
            {isLoading ? (
              "Bitte warten..."
            ) : (
              <>
                <Sword className="w-6 h-6 inline mr-2" />
                Mit diesem Charakter zur Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelector;
