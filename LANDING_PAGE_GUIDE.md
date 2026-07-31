# 🎉 Landing Page - Quick Start Guide

## Was wurde erstellt?

Eine komplette Landing Page für **Wietzendorf Landnerds** mit:

✅ **Haupt-Homepage** - Info über die Gruppe und Kampagne  
✅ **Session-Chronik** - Alle Sessions chronologisch  
✅ **Admin-Panel** - Zum Bearbeiten (nur für dich)  
✅ **Clean Design** - D&D-Theme, responsive  
✅ **API Backend** - Speichert alles in JSON

## 🚀 Sofort loslegen

### 1. Testen (Development)

```bash
# Im Projektordner
npm start
```

Dann öffne:

- **Landing Page**: http://localhost:5173/landing.html
- **Session Manager**: http://localhost:5173/index.html
- **Player View**: http://localhost:5173/player.html

### 2. Production Build & Deployment

```bash
# Build erstellen
npm run build

# Zum Pi übertragen
rsync -av --exclude 'node_modules' --exclude '.git' ./ pi@<PI-IP>:~/dnd-session-manager/

# Auf dem Pi: Service neu starten
ssh pi@<PI-IP>
cd ~/dnd-session-manager
sudo systemctl restart dnd-session-manager
```

## 📁 Was wurde erstellt?

### Neue Dateien:

```
src/components/landing/
├── LandingPage.jsx      # Hauptkomponente
├── SessionList.jsx      # Session-Übersicht
├── AboutSection.jsx     # Über uns Bereich
└── AdminPanel.jsx       # Admin-Interface

src/
└── landing-main.jsx     # Entry Point

data/
└── landing-data.json    # Deine Daten

landing.html             # HTML Entry
```

### Geänderte Dateien:

- `server.js` - Neue API-Endpoints für Landing Page
- `vite.config.js` - landing.html als Build-Target
- `README.md` - Aktualisiert

## 🌐 URL-Struktur (nach Deployment)

```
wietzendorf-landnerds.com/          → Landing Page (Hauptseite)
wietzendorf-landnerds.com/session   → Session Manager (GM)
wietzendorf-landnerds.com/player.html → Player View
```

## ✏️ Wie du Content bearbeitest

### Option 1: Admin-Panel (Empfohlen!)

1. Geh auf deine Landing Page
2. Scroll runter zum Footer
3. Klick "Admin-Login"
4. Passwort: `020266140297`
5. Bearbeite Infos und Sessions
6. Speichern!

### Option 2: Direkt die JSON bearbeiten

Öffne `data/landing-data.json` und bearbeite direkt.

## 📝 Session hinzufügen

**Im Admin-Panel:**

1. Geh zum Tab "Sessions"
2. Klick "Neue Session"
3. Fülle aus:
   - Titel (z.B. "Session #2 - Der Drache erwacht")
   - Datum
   - Ort (optional)
   - Zusammenfassung (was ist passiert)
4. Speichern!

**Via API** (für Fortgeschrittene):

```javascript
fetch("/api/landing/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    date: "2026-05-01",
    title: "Session #2",
    summary: "Die Helden...",
    location: "Taverne",
    author: "MasterCookie",
  }),
});
```

## 🎨 Design anpassen

Die Farben und das Design sind in den Components definiert:

**Hauptfarben:**

- Amber/Gold: `amber-500` - Für Highlights
- Purple: `purple-500` - Für Buttons
- Grau: `gray-800` - Für Hintergründe

**Wo ändern:**

- `src/components/landing/LandingPage.jsx` - Hauptfarben
- Tailwind Classes direkt in den Components

## 🔐 Sicherheit

**Aktuell:** Einfaches Passwort-Prompt für Admin

**Später erweitern:**

- Nutze das gleiche Auth-System wie Session Manager
- Oder separates Login-System

**Wichtig:** Die Landing Page ist **öffentlich lesbar**, nur das Admin-Panel ist geschützt.

## 🚀 Nächste Schritte

### Phase 1 (Jetzt):

- [x] Landing Page erstellt
- [x] Session-Chronik
- [x] Admin-Panel
- [ ] Mit echten Daten füllen
- [ ] Auf Pi deployen

### Phase 2 (Später):

- [ ] Bild-Upload für Sessions
- [ ] Spieler-Profile
- [ ] Kommentare zu Sessions
- [ ] Gallery-Seite

### Phase 3 (Nice to have):

- [ ] Markdown-Support in Session-Texten
- [ ] Tags/Kategorien für Sessions
- [ ] Suche/Filter
- [ ] RSS-Feed

## 🐛 Troubleshooting

### Landing Page zeigt nicht an

**Problem:** `Cannot GET /landing.html`

**Lösung:**

```bash
# Development: Direkt auf Vite-Dev-Server
http://localhost:5173/landing.html

# Production: Build muss erstellt sein
npm run build
```

### Admin-Panel speichert nicht

**Lösung:** Prüfe Browser-Konsole (F12) für Fehler. Backend muss laufen!

### Sessions werden nicht angezeigt

**Lösung:** Prüfe `data/landing-data.json` - ist das Format korrekt?

## 💡 Tipps

1. **Regelmäßig Backups:** `data/landing-data.json` sichern!
2. **Sessions nummerieren:** "Session #1", "Session #2" etc.
3. **Datum konsistent:** Immer YYYY-MM-DD Format
4. **Kurz & knackig:** Session-Summaries nicht zu lang

## 🆘 Support

Bei Fragen einfach mich fragen! 😊

---

**Viel Spaß mit deiner Landnerds-Website!** 🎲✨
