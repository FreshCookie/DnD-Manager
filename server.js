import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data", "session-data.json");
const DATA_FILE_18PLUS = path.join(
  __dirname,
  "data",
  "session-data-18plus.json",
);
const REFERENCE_DATA_FILE = path.join(__dirname, "data", "reference-data.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");
const SESSIONS_FILE = path.join(__dirname, "data", "active-sessions.json");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Middleware
app.use(cors());

// Optional: GZIP Kompression (benötigt: npm install compression)
try {
  const compression = await import("compression");
  app.use(compression.default());
  console.log("✓ GZIP Kompression aktiviert");
} catch (e) {
  console.log("ℹ️ GZIP Kompression nicht verfügbar (npm install compression)");
}

app.use(express.json({ limit: "50mb" }));

// Stelle sicher dass der data Ordner existiert
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
}

// Stelle sicher dass die JSON Datei existiert
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        cities: [],
        stories: [],
        npcs: [],
        locations: [],
        items: [],
        intros: [],
        theme: "dark",
        sessionTimes: {},
        players: [],
        companions: [],
        activePlayers: [],
        subLocations: [],
      },
      null,
      2,
    ),
  );
}

// GET - Lade Daten
app.get("/api/data", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const parsedData = JSON.parse(data);

    // Cache-Control: Bei Änderungen neu laden, aber kurzes Caching erlauben
    res.setHeader("Cache-Control", "public, max-age=5, must-revalidate");
    res.setHeader("ETag", `"${Date.now()}"`); // Vereinfachtes ETag

    res.json(parsedData);
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    res.status(500).json({ error: "Fehler beim Laden der Daten" });
  }
});

// POST - Speichere Daten
app.post("/api/data", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: "Daten erfolgreich gespeichert" });
  } catch (error) {
    console.error("Fehler beim Speichern der Daten:", error);
    res.status(500).json({ error: "Fehler beim Speichern der Daten" });
  }
});

// GET - Lade 18+ Session-Daten
app.get("/api/data-18plus", (req, res) => {
  try {
    // Erstelle Datei falls nicht vorhanden
    if (!fs.existsSync(DATA_FILE_18PLUS)) {
      const initialData = {
        cities: [],
        stories: [],
        npcs: [],
        locations: [],
        subLocations: [],
        items: [],
        intros: [],
        theme: "dark",
        sessionTimes: {},
        players: [],
        companions: [],
        activePlayers: [],
      };
      fs.writeFileSync(DATA_FILE_18PLUS, JSON.stringify(initialData, null, 2));
    }

    const data = fs.readFileSync(DATA_FILE_18PLUS, "utf8");
    const parsedData = JSON.parse(data);

    res.setHeader("Cache-Control", "public, max-age=5, must-revalidate");
    res.setHeader("ETag", `"${Date.now()}"`);

    res.json(parsedData);
  } catch (error) {
    console.error("Fehler beim Laden der 18+ Daten:", error);
    res.status(500).json({ error: "Fehler beim Laden der 18+ Daten" });
  }
});

// POST - Speichere 18+ Session-Daten
app.post("/api/data-18plus", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE_18PLUS, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: "18+ Daten erfolgreich gespeichert" });
  } catch (error) {
    console.error("Fehler beim Speichern der 18+ Daten:", error);
    res.status(500).json({ error: "Fehler beim Speichern der 18+ Daten" });
  }
});

// GET - Lade K&C Reference-Daten
app.get("/api/reference-data", (req, res) => {
  try {
    // Erstelle Datei falls nicht vorhanden
    if (!fs.existsSync(REFERENCE_DATA_FILE)) {
      const initialData = {
        kinks: [],
        classes: [],
        races: [],
        creatures: [],
        mechanics: [],
      };
      fs.writeFileSync(
        REFERENCE_DATA_FILE,
        JSON.stringify(initialData, null, 2),
      );
    }

    const data = fs.readFileSync(REFERENCE_DATA_FILE, "utf8");
    const parsedData = JSON.parse(data);

    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache für 1 Stunde
    res.json(parsedData);
  } catch (error) {
    console.error("Fehler beim Laden der Reference-Daten:", error);
    res.status(500).json({ error: "Fehler beim Laden der Reference-Daten" });
  }
});

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

// Helper: Lade Users
const loadUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const initialHash = bcrypt.hashSync("020266140297", 10);
      const initialData = {
        users: [
          {
            id: "gm_mastercookie",
            username: "MasterCookie",
            passwordHash: initialHash,
            role: "gm",
            createdAt: Date.now(),
          },
        ],
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2));
      return initialData.users;
    }
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data).users;
  } catch (error) {
    console.error("Fehler beim Laden der Users:", error);
    return [];
  }
};

// Helper: Speichere Users
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
    return true;
  } catch (error) {
    console.error("Fehler beim Speichern der Users:", error);
    return false;
  }
};

// Helper: Lade Sessions
const loadSessions = () => {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) {
      fs.writeFileSync(
        SESSIONS_FILE,
        JSON.stringify({ sessions: [] }, null, 2),
      );
      return [];
    }
    const data = fs.readFileSync(SESSIONS_FILE, "utf8");
    return JSON.parse(data).sessions;
  } catch (error) {
    console.error("Fehler beim Laden der Sessions:", error);
    return [];
  }
};

// Helper: Speichere Sessions
const saveSessions = (sessions) => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions }, null, 2));
    return true;
  } catch (error) {
    console.error("Fehler beim Speichern der Sessions:", error);
    return false;
  }
};

// POST /api/auth/login - Login für GM und Spieler
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username und Passwort erforderlich" });
    }

    const users = loadUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    // Erstelle Session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessions = loadSessions();

    const newSession = {
      sessionId,
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      character: null, // Wird später gesetzt bei Spielern
    };

    sessions.push(newSession);
    saveSessions(sessions);

    res.json({
      success: true,
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        characters: user.characters || [],
      },
    });
  } catch (error) {
    console.error("Fehler beim Login:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// POST /api/auth/register - Registrierung für Spieler
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, password, selectedCharacters } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username und Passwort erforderlich" });
    }

    if (!selectedCharacters || selectedCharacters.length === 0) {
      return res
        .status(400)
        .json({ error: "Mindestens ein Charakter muss ausgewählt werden" });
    }

    const users = loadUsers();

    // Prüfe ob Username bereits existiert
    if (users.find((u) => u.username === username)) {
      return res.status(409).json({ error: "Username bereits vergeben" });
    }

    // Hash Passwort
    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      passwordHash,
      role: "player",
      characters: selectedCharacters,
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    res.json({
      success: true,
      message: "Registrierung erfolgreich",
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        characters: newUser.characters,
      },
    });
  } catch (error) {
    console.error("Fehler bei Registrierung:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// POST /api/auth/join-session - Spieler wählt Charakter und tritt Session bei
app.post("/api/auth/join-session", (req, res) => {
  try {
    const { sessionId, characterId } = req.body;

    if (!sessionId || !characterId) {
      return res
        .status(400)
        .json({ error: "SessionId und CharacterId erforderlich" });
    }

    const sessions = loadSessions();
    const session = sessions.find((s) => s.sessionId === sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }

    // Update Session mit Charakter
    session.character = characterId;
    session.lastActivity = Date.now();

    saveSessions(sessions);

    res.json({
      success: true,
      message: "Session beigetreten",
      session,
    });
  } catch (error) {
    console.error("Fehler beim Session-Beitritt:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// POST /api/auth/logout - Einzelner Logout
app.post("/api/auth/logout", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "SessionId erforderlich" });
    }

    let sessions = loadSessions();
    sessions = sessions.filter((s) => s.sessionId !== sessionId);
    saveSessions(sessions);

    res.json({ success: true, message: "Erfolgreich ausgeloggt" });
  } catch (error) {
    console.error("Fehler beim Logout:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// POST /api/auth/logout-all - GM loggt alle Spieler aus
app.post("/api/auth/logout-all", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(401).json({ error: "Nicht autorisiert" });
    }

    const sessions = loadSessions();
    const gmSession = sessions.find((s) => s.sessionId === sessionId);

    if (!gmSession || gmSession.role !== "gm") {
      return res
        .status(403)
        .json({ error: "Nur GM kann alle Spieler ausloggen" });
    }

    // Entferne alle Player-Sessions, behalte GM-Session
    const newSessions = sessions.filter((s) => s.role === "gm");
    saveSessions(newSessions);

    res.json({ success: true, message: "Alle Spieler ausgeloggt" });
  } catch (error) {
    console.error("Fehler beim Massen-Logout:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// GET /api/auth/online-players - GM sieht online Spieler
app.get("/api/auth/online-players", (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      return res.status(401).json({ error: "Nicht autorisiert" });
    }

    const sessions = loadSessions();
    const gmSession = sessions.find((s) => s.sessionId === sessionId);

    if (!gmSession || gmSession.role !== "gm") {
      return res.status(403).json({ error: "Nur GM hat Zugriff" });
    }

    // Filtere nur Player-Sessions
    const playerSessions = sessions.filter((s) => s.role === "player");

    res.json({
      success: true,
      onlinePlayers: playerSessions,
      count: playerSessions.length,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Online-Spieler:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// POST /api/auth/verify-session - Prüfe ob Session noch gültig
app.post("/api/auth/verify-session", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ error: "SessionId erforderlich", valid: false });
    }

    const sessions = loadSessions();
    const session = sessions.find((s) => s.sessionId === sessionId);

    if (!session) {
      return res.json({ valid: false, error: "Session nicht gefunden" });
    }

    // Update lastActivity
    session.lastActivity = Date.now();
    saveSessions(sessions);

    res.json({
      valid: true,
      session,
    });
  } catch (error) {
    console.error("Fehler bei Session-Verifikation:", error);
    res.status(500).json({ error: "Interner Server-Fehler", valid: false });
  }
});

// PUT /api/characters/:characterId - Update character data
app.put("/api/characters/:characterId", (req, res) => {
  try {
    const { characterId } = req.params;
    const { name, class: charClass, race, background, level, hp, maxHp, alignment } = req.body;
    const sessionId = req.cookies.sessionId;

    // Verify session
    if (!sessionId) {
      return res.status(401).json({ error: "Nicht angemeldet" });
    }

    const sessions = loadSessions();
    const session = sessions.find((s) => s.sessionId === sessionId);

    if (!session) {
      return res.status(401).json({ error: "Ungültige Session" });
    }

    // Authorization: Players can only edit their own character
    if (session.role === "player" && session.character !== characterId) {
      return res.status(403).json({ error: "Keine Berechtigung" });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Charaktername ist erforderlich" });
    }

    // Load session data
    const sessionData = loadData();

    if (!sessionData.players || !Array.isArray(sessionData.players)) {
      return res.status(500).json({ error: "Spielerdaten nicht gefunden" });
    }

    // Find player by characterId (ID field)
    const playerIndex = sessionData.players.findIndex(
      (p) => p.id === characterId
    );

    if (playerIndex === -1) {
      return res.status(404).json({ error: "Charakter nicht gefunden" });
    }

    // Update player data
    const player = sessionData.players[playerIndex];
    
    // Update basic fields
    player.name = name.trim();
    
    // Update optional fields
    if (charClass !== undefined) player.class = charClass;
    if (race !== undefined) player.race = race;
    if (background !== undefined) player.background = background;
    if (level !== undefined) player.level = level;
    if (hp !== undefined) player.hp = hp;
    if (maxHp !== undefined) player.maxHp = maxHp;
    if (alignment !== undefined) player.alignment = alignment;

    // Update description field (legacy format: "Race / Class\nBackground...")
    if (race || charClass || background) {
      let descParts = [];
      if (race && charClass) {
        descParts.push(`${race} / ${charClass}`);
      } else if (race) {
        descParts.push(race);
      } else if (charClass) {
        descParts.push(charClass);
      }
      if (background) {
        descParts.push(background);
      }
      player.description = descParts.join("\n");
    }

    // Save updated data
    saveData(sessionData);

    console.log(`✅ Character ${characterId} updated by ${session.username}`);

    res.json({
      success: true,
      message: "Charakter erfolgreich aktualisiert",
      player,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Charakters:", error);
    res.status(500).json({ error: "Interner Server-Fehler" });
  }
});

// ============================================================================
// END AUTH ENDPOINTS
// ============================================================================

// In Production: Serve static files from dist folder
if (IS_PRODUCTION) {
  const distPath = path.join(__dirname, "dist");

  // Prüfe ob dist Ordner existiert
  if (fs.existsSync(distPath)) {
    console.log("📦 Serving static files from dist folder");

    // Serve static assets (CSS, JS, images, etc.)
    app.use(express.static(distPath));

    // Serve all HTML routes
    app.get("*", (req, res) => {
      // Bestimme welche HTML Datei geladen werden soll
      if (req.path.includes("/player.html")) {
        res.sendFile(path.join(distPath, "player.html"));
      } else if (req.path.includes("/hexagon-player.html")) {
        res.sendFile(path.join(distPath, "hexagon-player.html"));
      } else if (!req.path.startsWith("/api")) {
        // Alle anderen Routen -> index.html (GM View)
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  } else {
    console.warn("⚠️ Production mode aber kein 'dist' Ordner gefunden!");
    console.warn("⚠️ Bitte führe 'npm run build' aus.");
  }
} else {
  console.log("🔧 Development mode - Frontend wird von Vite bereitgestellt");
}

// HTTP Server für Socket.io
const httpServer = createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io PlayerView Sync
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // GM sendet PlayerView Update
  socket.on("gm:update-playerview", (data) => {
    console.log("🚀 GM broadcasting PlayerView update:", data);
    io.emit("player:playerview-update", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend Server läuft auf Port ${PORT}`);
  console.log(`📁 Daten werden gespeichert in: ${DATA_FILE}`);
  console.log(`🌐 Lokal erreichbar: http://localhost:${PORT}`);
  console.log(`🌐 Im Netzwerk erreichbar: http://<raspberry-pi-ip>:${PORT}`);
  if (IS_PRODUCTION) {
    console.log(
      "🏭 Production Mode - Frontend wird vom Backend bereitgestellt",
    );
  }
});
