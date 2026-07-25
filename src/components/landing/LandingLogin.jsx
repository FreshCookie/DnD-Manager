import React, { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

export default function LandingLogin({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
          onLoginSuccess(data.user);
        } else {
          setError(data.error || "Login fehlgeschlagen");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password, selectedCharacters: [] }),
        });
        const data = await res.json();
        if (data.success) {
          onLoginSuccess(data.user);
        } else {
          setError(data.error || "Registrierung fehlgeschlagen");
        }
      }
    } catch {
      setError("Verbindungsfehler – bitte erneut versuchen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/images/wietzendorf_landnerds_background_portrait.png)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-65" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/wietzendorf_landnerds_icon.png"
            alt="Wietzendorf Landnerds"
            className="w-24 h-24 object-contain mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-bold text-amber-400 font-serif drop-shadow-lg">
            Wietzendorf Landnerds
          </h1>
          <p className="text-gray-300 mt-2">
            {isLogin ? "Willkommen zurück!" : "Neu hier? Registriere dich!"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-amber-500/30">
          {/* Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                isLogin ? "bg-amber-600 text-white" : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                !isLogin ? "bg-amber-600 text-white" : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Registrieren
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Dein Benutzername"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Dein Passwort"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              {isLoading ? "..." : isLogin ? "Einloggen" : "Registrieren"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
