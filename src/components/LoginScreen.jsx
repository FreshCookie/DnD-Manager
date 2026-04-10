import React, { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff, Users } from "lucide-react";

const LoginScreen = ({ onLogin, onRegister, availableCharacters }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedChars, setSelectedChars] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await onLogin(username, password);
        if (!result.success) {
          setError(result.error || "Login fehlgeschlagen");
        }
      } else {
        if (selectedChars.length === 0) {
          setError("Bitte wähle mindestens einen Charakter aus");
          setIsLoading(false);
          return;
        }
        const result = await onRegister(username, password, selectedChars);
        if (!result.success) {
          setError(result.error || "Registrierung fehlgeschlagen");
        }
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharSelection = (charId) => {
    setSelectedChars((prev) =>
      prev.includes(charId)
        ? prev.filter((id) => id !== charId)
        : [...prev, charId],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            D&D Session Manager
          </h1>
          <p className="text-gray-300 text-lg">
            {isLogin ? "Willkommen zurück" : "Neue Registrierung"}
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          {/* Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSelectedChars([]);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                isLogin
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Registrieren
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Dein Username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Dein Passwort"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Character Selection (nur bei Registrierung) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Deine Charaktere
                </label>
                <div className="bg-gray-700/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {availableCharacters && availableCharacters.length > 0 ? (
                    <div className="space-y-2">
                      {availableCharacters.map((char) => (
                        <label
                          key={char.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            selectedChars.includes(char.id)
                              ? "bg-purple-600/50 border-2 border-purple-400"
                              : "bg-gray-600/30 border-2 border-transparent hover:bg-gray-600/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedChars.includes(char.id)}
                            onChange={() => toggleCharSelection(char.id)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          {char.image && (
                            <img
                              src={char.image}
                              alt={char.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <span className="text-white font-semibold">
                            {char.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      Keine Charaktere verfügbar
                    </p>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Wähle einen oder mehrere Charaktere aus
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105"
              }`}
            >
              {isLoading
                ? "Bitte warten..."
                : isLogin
                  ? "Einloggen"
                  : "Registrieren"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Probleme beim Login? Kontaktiere deinen GM</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
