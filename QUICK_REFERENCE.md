# 📋 DnD Session Manager - Quick Reference

## 🚀 Projekt auf Pi übertragen

### Via rsync (empfohlen)

```bash
rsync -av --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ pi@192.168.x.x:~/dnd-session-manager/
```

### Via scp (einzelne Dateien)

```bash
scp -r ./* pi@192.168.x.x:~/dnd-session-manager/
```

## 🎯 Auf dem Pi

### Initial Setup

```bash
ssh pi@192.168.x.x
cd ~/dnd-session-manager
chmod +x pi-setup.sh
./pi-setup.sh
```

### Cloudflare Tunnel Setup (für Remote-Zugriff)

```bash
chmod +x setup-cloudflare-tunnel.sh
./setup-cloudflare-tunnel.sh
```

## 🛠️ Service-Befehle

### DnD Session Manager

```bash
# Status
sudo systemctl status dnd-session-manager

# Starten
sudo systemctl start dnd-session-manager

# Stoppen
sudo systemctl stop dnd-session-manager

# Neu starten
sudo systemctl restart dnd-session-manager

# Logs (Live)
sudo journalctl -u dnd-session-manager -f

# Letzte 50 Log-Zeilen
sudo journalctl -u dnd-session-manager -n 50
```

### Cloudflare Tunnel

```bash
# Status
sudo systemctl status cloudflared

# Neu starten
sudo systemctl restart cloudflared

# Logs (Live)
sudo journalctl -u cloudflared -f

# Tunnel-Info
cloudflared tunnel list
cloudflared tunnel info dnd-session
```

## 🌐 Zugriffs-URLs

### Lokales Netzwerk

```
GM View:        http://192.168.x.x:3001
Player View:    http://192.168.x.x:3001/player.html
Hexagon View:   http://192.168.x.x:3001/hexagon-player.html
```

### Remote (mit Cloudflare Tunnel)

```
GM View:        https://dnd.deine-domain.de
Player View:    https://dnd.deine-domain.de/player.html
Hexagon View:   https://dnd.deine-domain.de/hexagon-player.html
```

## 🔐 Standard Login-Daten

```
Username: MasterCookie
Passwort: 020266140297
```

**⚠️ WICHTIG:** Nach dem ersten Login ändern!

## 📝 Wichtige Dateien

```
~/dnd-session-manager/
├── data/
│   ├── session-data.json       # Hauptdaten
│   ├── session-data-18plus.json # 18+ Session
│   ├── users.json              # Login-Daten
│   └── active-sessions.json    # Aktive Sessions
├── server.js                   # Backend
└── ~/.cloudflared/config.yml   # Tunnel-Config
```

## 🔄 Updates einspielen

```bash
# 1. Auf deinem PC: Projekt hochladen
rsync -av --exclude 'node_modules' ./ pi@192.168.x.x:~/dnd-session-manager/

# 2. Auf dem Pi: Dependencies updaten & neu builden
ssh pi@192.168.x.x
cd ~/dnd-session-manager
npm install
npm run build

# 3. Service neu starten
sudo systemctl restart dnd-session-manager

# 4. Prüfen ob alles läuft
sudo systemctl status dnd-session-manager
```

## 🐛 Troubleshooting

### Port 3001 bereits in Verwendung

```bash
# Finde Prozess
sudo lsof -i :3001

# Beende Prozess (ersetze PID)
kill -9 <PID>
```

### Service startet nicht

```bash
# Logs prüfen
sudo journalctl -u dnd-session-manager -n 100

# Manuell testen
cd ~/dnd-session-manager
node server.js
```

### Cloudflare Tunnel verbindet nicht

```bash
# Cloudflared neu installieren
sudo cloudflared update

# Service neu starten
sudo systemctl restart cloudflared

# Logs prüfen
sudo journalctl -u cloudflared -f
```

### Keine Verbindung zum Server

```bash
# 1. Ist der Service am laufen?
sudo systemctl status dnd-session-manager

# 2. Ist der Pi erreichbar?
ping 192.168.x.x

# 3. Läuft etwas auf Port 3001?
curl http://localhost:3001
```

## 🔥 Emergency Reset

### Service komplett neu aufsetzen

```bash
sudo systemctl stop dnd-session-manager
sudo systemctl disable dnd-session-manager
sudo rm /etc/systemd/system/dnd-session-manager.service
sudo systemctl daemon-reload

cd ~/dnd-session-manager
./pi-setup.sh
```

### Cloudflare Tunnel neu einrichten

```bash
sudo systemctl stop cloudflared
sudo cloudflared service uninstall
rm -rf ~/.cloudflared/

./setup-cloudflare-tunnel.sh
```

## 📊 Performance-Check

```bash
# CPU & RAM Nutzung
htop

# Disk Space
df -h

# Netzwerk-Traffic
sudo iftop
```

## 💾 Backup erstellen

```bash
# Auf deinem PC (automatisches Backup)
rsync -av pi@192.168.x.x:~/dnd-session-manager/data/ ./backup-$(date +%Y%m%d)/

# Nur Daten sichern
scp pi@192.168.x.x:~/dnd-session-manager/data/*.json ./backup/
```

## 🎮 Spielbetrieb

### Vor der Session

```bash
# Alles läuft?
sudo systemctl status dnd-session-manager cloudflared

# Backup erstellen
rsync -av pi@192.168.x.x:~/dnd-session-manager/data/ ./backup-heute/
```

### Nach der Session

```bash
# Logs sichern (falls was schiefging)
ssh pi@192.168.x.x "sudo journalctl -u dnd-session-manager --since today" > session-logs.txt
```

## 🆘 Schnelle Hilfe

| Problem                | Lösung                                          |
| ---------------------- | ----------------------------------------------- |
| Server antwortet nicht | `sudo systemctl restart dnd-session-manager`    |
| Tunnel offline         | `sudo systemctl restart cloudflared`            |
| Daten kaputt           | Backup von `data/*.json` einspielen             |
| Update fehlgeschlagen  | Altes `node_modules` löschen, `npm install` neu |
| Port-Konflikt          | Service stoppen, Port freigeben, neu starten    |

---

**💡 Tipp:** Speichere diese Datei als Lesezeichen oder drucke sie aus!
