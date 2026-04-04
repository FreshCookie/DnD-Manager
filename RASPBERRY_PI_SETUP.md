# DnD Session Manager - Raspberry Pi Setup Anleitung

## 🎯 Ziel

Den DnD Session Manager auf dem Raspberry Pi 2 Model B als automatisch startenden Service einrichten.

## 📋 Voraussetzungen

- Raspberry Pi 2 Model B mit Raspberry Pi OS Bookworm (✅ bereits installiert)
- SSH-Zugriff aktiviert (✅ bereits eingerichtet)
- Netzwerkverbindung (LAN/WLAN)
- PC/Laptop im gleichen Netzwerk

---

## 🚀 Schritt-für-Schritt Anleitung

### 1️⃣ Node.js auf dem Raspberry Pi installieren

Verbinde dich per SSH mit deinem Pi:

```bash
ssh pi@raspberrypi.local
# oder mit IP-Adresse: ssh pi@<IP-ADRESSE>
```

Installiere Node.js 18 (ARMv7-kompatibel):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Prüfe die Installation:

```bash
node --version  # sollte v18.x.x zeigen
npm --version   # sollte v9.x.x oder höher zeigen
```

---

### 2️⃣ Projekt auf den Raspberry Pi übertragen

**Option A: Via Git (empfohlen)**

```bash
cd ~
git clone https://github.com/FreshCookie/DnD-Manager.git
cd DnD-Manager
```

**Option B: Via USB-Stick**

1. Kopiere das gesamte Projektverzeichnis auf einen USB-Stick
2. Stecke den Stick an den Pi
3. Der Stick wird automatisch gemountet (meist unter `/media/pi/`)
4. Kopiere die Dateien:

```bash
cd ~
cp -r /media/pi/<STICK-NAME>/dnd-session-manager ./DnD-Manager
cd DnD-Manager
```

---

### 3️⃣ Dependencies installieren und Production Build erstellen

```bash
cd ~/DnD-Manager

# Dependencies installieren (kann 5-10 Minuten dauern auf dem Pi 2)
npm install

# Production Build erstellen (kann ebenfalls 5-10 Minuten dauern)
npm run build
```

Nach dem Build sollte ein `dist/` Ordner erstellt worden sein.

---

### 4️⃣ Systemd Service einrichten (Autostart)

Erstelle die Service-Datei:

```bash
sudo nano /etc/systemd/system/dnd-session-manager.service
```

Füge folgenden Inhalt ein (ersetze `pi` mit deinem Username falls anders):

```ini
[Unit]
Description=DnD Session Manager
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/DnD-Manager
Environment="NODE_ENV=production"
Environment="PORT=3001"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Speichern: `Ctrl+O`, `Enter`, `Ctrl+X`

Service aktivieren und starten:

```bash
# Service neu laden
sudo systemctl daemon-reload

# Service aktivieren (Autostart beim Booten)
sudo systemctl enable dnd-session-manager

# Service jetzt starten
sudo systemctl start dnd-session-manager

# Status prüfen
sudo systemctl status dnd-session-manager
```

Du solltest sehen: `Active: active (running)`

---

### 5️⃣ Netzwerkzugriff testen

**Finde die IP-Adresse des Pi:**

```bash
hostname -I
```

Notiere die erste IP-Adresse (z.B. `192.168.1.42`)

**Vom PC/Laptop aus testen:**
Öffne einen Browser und gehe zu:

- **GM View:** `http://raspberrypi.local:3001` oder `http://192.168.1.42:3001`
- **Player View:** `http://raspberrypi.local:3001/player.html`
- **Hexagon Player:** `http://raspberrypi.local:3001/hexagon-player.html`

---

## 🔧 Nützliche Befehle

### Service verwalten

```bash
# Service stoppen
sudo systemctl stop dnd-session-manager

# Service neu starten
sudo systemctl restart dnd-session-manager

# Status anzeigen
sudo systemctl status dnd-session-manager

# Logs anzeigen
sudo journalctl -u dnd-session-manager -f

# Service deaktivieren (kein Autostart)
sudo systemctl disable dnd-session-manager
```

### Code aktualisieren

```bash
cd ~/DnD-Manager

# Änderungen von Git holen
git pull

# Dependencies updaten
npm install

# Neuen Build erstellen
npm run build

# Service neu starten
sudo systemctl restart dnd-session-manager
```

### Dateien vom PC auf Pi übertragen (SCP)

```bash
# Von deinem PC aus (in PowerShell):
scp -r "d:\Projekte\Projekte HTML\DnD Session Manager\dnd-session-manager" pi@raspberrypi.local:~/DnD-Manager
```

---

## 🐛 Troubleshooting

### Service startet nicht

```bash
# Detaillierte Logs anzeigen
sudo journalctl -u dnd-session-manager -n 50 --no-pager

# Manuell testen
cd ~/DnD-Manager
NODE_ENV=production node server.js
```

### Port bereits belegt

```bash
# Prüfe welcher Prozess Port 3001 nutzt
sudo netstat -tlnp | grep 3001

# Oder ändere den Port in der Service-Datei:
sudo nano /etc/systemd/system/dnd-session-manager.service
# Ändere: Environment="PORT=3001" zu z.B. Environment="PORT=8080"
```

### Zu wenig RAM

Der Pi 2 hat nur 1GB RAM. Falls Probleme auftreten:

```bash
# Swap-Speicher erhöhen
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Ändere: CONF_SWAPSIZE=100 zu CONF_SWAPSIZE=512
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Kann nicht vom PC zugreifen

1. Prüfe ob Pi und PC im gleichen Netzwerk sind
2. Prüfe die Pi IP-Adresse: `hostname -I`
3. Prüfe ob Service läuft: `sudo systemctl status dnd-session-manager`
4. Prüfe Firewall auf dem PC (Windows Firewall)
5. Ping-Test: `ping raspberrypi.local` (vom PC)

---

## 📊 Performance-Tipps für Pi 2

Der Raspberry Pi 2 ist nicht sehr leistungsstark. Hier ein paar Tipps:

1. **Keine anderen Programme laufen lassen** während Sessions
2. **Bilder optimieren** - große Bilder im `/public/images/` Ordner komprimieren
3. **Sessions-Daten aufräumen** - alte Einträge aus `session-data.json` löschen
4. **Browser-Cache aktivieren** - Die Anwendung nutzt bereits Caching

---

## ✅ Fertig!

Nach dieser Anleitung sollte:

- ✅ Der DnD Session Manager beim Booten automatisch starten
- ✅ Er im Netzwerk unter `http://raspberrypi.local:3001` erreichbar sein
- ✅ Alle Änderungen automatisch in `data/session-data.json` gespeichert werden
- ✅ Du von jedem Gerät im Netzwerk zugreifen können

**Viel Spaß bei deinen Sessions! 🎲**
