import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "data", "session-data.json");

// Middleware
app.use(cors());
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
      },
      null,
      2
    )
  );
}

// GET - Lade Daten
app.get("/api/data", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend Server läuft auf Port ${PORT}`);
  console.log(`📁 Daten werden gespeichert in: ${DATA_FILE}`);
  console.log(`🌐 Erreichbar unter: http://192.168.2.100:${PORT}`);
});
