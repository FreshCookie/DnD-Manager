import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lade Session aus LocalStorage beim Start
  useEffect(() => {
    const savedSessionId = localStorage.getItem("dnd-session-id");
    const savedUser = localStorage.getItem("dnd-user");
    const savedCharacter = localStorage.getItem("dnd-character");

    if (savedSessionId && savedUser) {
      // Verifiziere Session beim Server
      verifySession(
        savedSessionId,
        JSON.parse(savedUser),
        savedCharacter ? JSON.parse(savedCharacter) : null,
      );
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifySession = async (sid, usr, char) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.valid) {
        setSessionId(sid);
        setUser(usr);
        setCharacter(char);
        setIsAuthenticated(true);
      } else {
        // Session ungültig - logout
        logout();
      }
    } catch (error) {
      console.error("Fehler bei Session-Verifikation:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionId(data.sessionId);
        setUser(data.user);
        setIsAuthenticated(true);

        localStorage.setItem("dnd-session-id", data.sessionId);
        localStorage.setItem("dnd-user", JSON.stringify(data.user));

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login fehlgeschlagen" };
      }
    } catch (error) {
      console.error("Login-Fehler:", error);
      return { success: false, error: "Netzwerkfehler" };
    }
  };

  const register = async (username, password, selectedCharacters) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password, selectedCharacters }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Nach erfolgreicher Registrierung automatisch einloggen
        return await login(username, password);
      } else {
        return {
          success: false,
          error: data.error || "Registrierung fehlgeschlagen",
        };
      }
    } catch (error) {
      console.error("Registrierungs-Fehler:", error);
      return { success: false, error: "Netzwerkfehler" };
    }
  };

  const joinSession = async (characterId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/join-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ characterId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCharacter(characterId);
        localStorage.setItem("dnd-character", JSON.stringify(characterId));
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Char-Auswahl fehlgeschlagen",
        };
      }
    } catch (error) {
      console.error("Join-Session-Fehler:", error);
      return { success: false, error: "Netzwerkfehler" };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout-Fehler:", error);
    } finally {
      setSessionId(null);
      setUser(null);
      setCharacter(null);
      setIsAuthenticated(false);
      localStorage.removeItem("dnd-session-id");
      localStorage.removeItem("dnd-user");
      localStorage.removeItem("dnd-character");
    }
  };

  const logoutAllPlayers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Logout-All-Fehler:", error);
      return { success: false, error: "Netzwerkfehler" };
    }
  };

  const getOnlinePlayers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/online-players`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, players: data.onlinePlayers };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Online-Players-Fehler:", error);
      return { success: false, error: "Netzwerkfehler" };
    }
  };

  const value = {
    sessionId,
    user,
    character,
    isAuthenticated,
    isLoading,
    login,
    register,
    joinSession,
    logout,
    logoutAllPlayers,
    getOnlinePlayers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
