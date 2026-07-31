# 🎲 DnD Session Manager

Ein vollständiges D&D Session Management Tool mit GM-Ansicht, Player-Ansicht und Hexagon-Exploration. Läuft auf Raspberry Pi und synchronisiert in Echtzeit zwischen allen Spielern.

## ✨ Features

- 🎭 **GM View**: Vollständige Session-Verwaltung mit NPCs, Locations, Items & mehr
- 👥 **Player View**: Dedizierte Spieler-Ansicht mit Live-Updates
- 🗺️ **Hexagon Exploration**: Interaktive Hex-Map für Exploration
- 🔄 **Echtzeit-Sync**: WebSocket-basierte Live-Synchronisation
- 🎵 **Music Player**: Integrierter Musik-Player mit verschiedenen Moods
- 🎲 **Dice Roller**: Eingebauter Würfel-Simulator
- 🌓 **Dark/Light Mode**: Umschaltbares Theme
- 🔐 **Login-System**: Geschützte GM-Ansicht
- 📱 **Responsive**: Funktioniert auf Desktop, Tablet & Handy
- 🌍 **Remote Access**: Über Cloudflare Tunnel von überall erreichbar

## 🚀 Quick Start

### Lokale Entwicklung (Windows/Mac/Linux)

```bash
# Dependencies installieren
npm install

# Dev-Server starten (Frontend + Backend)
npm start
```

Der Server läuft dann auf:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Raspberry Pi Deployment

#### Variante 1: Lokales Netzwerk

```bash
# Projekt auf Pi übertragen
rsync -av --exclude 'node_modules' --exclude '.git' ./ pi@<PI-IP>:~/dnd-session-manager/

# SSH zum Pi
ssh pi@<PI-IP>

# Setup ausführen
cd ~/dnd-session-manager
chmod +x pi-setup.sh
./pi-setup.sh
```

Zugriff im lokalen Netzwerk:

- GM View: http://<PI-IP>:3001
- Player View: http://<PI-IP>:3001/player.html

#### Variante 2: Von überall erreichbar (Cloudflare Tunnel) ⭐

**Empfohlen für Remote-Spieler!**

```bash
# Cloudflare Tunnel Setup
chmod +x setup-cloudflare-tunnel.sh
./setup-cloudflare-tunnel.sh
```

Nach dem Setup erreichbar unter:

- GM View: https://dnd.deine-domain.de
- Player View: https://dnd.deine-domain.de/player.html

**📖 Detaillierte Anleitung:** Siehe [CLOUDFLARE_TUNNEL_SETUP.md](CLOUDFLARE_TUNNEL_SETUP.md)

**Vorteile:**

- ✅ Kein Port Forwarding nötig
- ✅ Automatisches HTTPS
- ✅ Von überall erreichbar
- ✅ Kostenlos
- ✅ WebSocket Support

## 📦 Verfügbare Scripts

```bash
npm run dev          # Frontend Dev-Server (Vite)
npm run server       # Backend Server starten
npm start            # Beide gleichzeitig (Development)
npm run build        # Production Build
npm run start:production  # Production Server
```

## 🔧 Technologie-Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Echtzeit**: Socket.IO (WebSocket)
- **Auth**: bcrypt.js
- **Deployment**: Raspberry Pi, Cloudflare Tunnel

## 📁 Projekt-Struktur

```
dnd-session-manager/
├── src/                    # React Frontend
│   ├── components/        # React Komponenten
│   ├── contexts/          # React Contexts
│   ├── hooks/             # Custom Hooks
│   └── utils/             # Utility-Funktionen
├── public/                # Statische Assets
│   ├── images/           # Bilder & Assets
│   └── music/            # Musik-Dateien
├── data/                  # JSON Datenbanken
├── server.js             # Express Backend
├── pi-setup.sh           # Raspberry Pi Setup
├── setup-cloudflare-tunnel.sh  # Cloudflare Setup
└── CLOUDFLARE_TUNNEL_SETUP.md  # Tunnel-Dokumentation
```

## 🎮 Verwendung

### Als GM (Game Master)

1. Öffne die GM-View: http://deine-url
2. Login: Username "MasterCookie" / Passwort "020266140297"
3. Session vorbereiten (NPCs, Locations, Items, etc.)
4. Live-Updates werden automatisch an Spieler gesendet

### Als Spieler

1. Öffne die Player-View: http://deine-url/player.html
2. Kein Login nötig
3. Sieh in Echtzeit was der GM anzeigt
4. Interagiere mit Hexagon-Map für Exploration

## 🔐 Login-Daten ändern

Die Standard-Login-Daten solltest du nach der ersten Einrichtung ändern. Die User-Daten sind in `data/users.json` gespeichert.

## 🛠️ Service-Verwaltung (Raspberry Pi)

```bash
# Status prüfen
sudo systemctl status dnd-session-manager

# Neu starten
sudo systemctl restart dnd-session-manager

# Logs ansehen
sudo journalctl -u dnd-session-manager -f

# Cloudflare Tunnel Status (falls eingerichtet)
sudo systemctl status cloudflared
```

## 🌐 Remote-Zugriff einrichten

Siehe die detaillierte Anleitung in [CLOUDFLARE_TUNNEL_SETUP.md](CLOUDFLARE_TUNNEL_SETUP.md) für:

- ✅ Schritt-für-Schritt Setup
- ✅ Troubleshooting
- ✅ Sicherheits-Tipps
- ✅ Performance-Optimierung

## 📝 Lizenz

Privates Projekt - Alle Rechte vorbehalten

## 🎲 Viel Spaß beim Spielen!

Erstellt mit ❤️ für epische D&D Sessions
