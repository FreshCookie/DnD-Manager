# 🌐 Cloudflare Tunnel Setup - DnD Session Manager

Diese Anleitung zeigt dir, wie du deinen DnD Session Manager über Cloudflare Tunnel für deine Spieler von überall aus erreichbar machst - **ohne Port Forwarding** und mit **kostenlosem HTTPS**!

## 📋 Voraussetzungen

- ✅ Raspberry Pi mit laufendem DnD Session Manager
- ✅ Cloudflare Account (kostenlos): https://dash.cloudflare.com/sign-up
- ✅ Eine Domain, die bei Cloudflare verwaltet wird (oder übertrage eine)
- ✅ SSH-Zugriff auf deinen Raspberry Pi

## 🎯 Was bringt dir Cloudflare Tunnel?

- 🔒 **Keine Ports öffnen** - Ausgehende Verbindung vom Pi zu Cloudflare
- 🔐 **Automatisches HTTPS** - Kostenlose SSL-Zertifikate
- 🌍 **Von überall erreichbar** - Deine Spieler brauchen nur die URL
- 🛡️ **DDoS-Schutz** - Cloudflare schützt vor Angriffen
- ⚡ **Schnell & Stabil** - Cloudflare's globales Netzwerk
- 💰 **Komplett kostenlos** - Für deine Anwendung

## 🚀 Quick Start (Automatisches Setup)

### Schritt 1: Dateien auf den Pi übertragen

```bash
# Auf deinem PC (in diesem Projektordner)
scp setup-cloudflare-tunnel.sh pi@<PI-IP-ADRESSE>:~/dnd-session-manager/

# Oder mit dem gesamten Projekt
rsync -av --exclude 'node_modules' --exclude '.git' ./ pi@<PI-IP-ADRESSE>:~/dnd-session-manager/
```

### Schritt 2: Setup ausführen

```bash
# SSH zum Pi
ssh pi@<PI-IP-ADRESSE>

# Zum Projekt-Ordner
cd ~/dnd-session-manager

# Script ausführbar machen
chmod +x setup-cloudflare-tunnel.sh

# Setup starten
./setup-cloudflare-tunnel.sh
```

### Schritt 3: Den Anweisungen folgen

Das Script wird dich durch folgende Schritte führen:

1. **Cloudflared installieren** (automatisch)
2. **Cloudflare Login** - Browser öffnet sich für die Autorisierung
3. **Tunnel erstellen** - Du gibst einen Namen ein (z.B. "dnd-session")
4. **DNS konfigurieren** - Du gibst deine (Sub-)Domain ein (z.B. "dnd.example.com")
5. **Service aktivieren** - Startet automatisch und läuft im Hintergrund

**Fertig!** 🎉 Dein Session Manager ist jetzt unter `https://dnd.example.com` erreichbar!

## 📱 Zugriff für deine Spieler

Nach dem Setup können deine Spieler von überall zugreifen:

- **GM View**: `https://deine-domain.de`
- **Player View**: `https://deine-domain.de/player.html`
- **Hexagon View**: `https://deine-domain.de/hexagon-player.html`

## 🔧 Manuelle Konfiguration (Optional)

Falls du das Setup manuell durchführen möchtest:

### 1. Cloudflared installieren

```bash
# Für ARM64 (Raspberry Pi 4/5, 64-bit OS)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb

# Für ARM 32-bit (ältere Pi's oder 32-bit OS)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.deb
sudo dpkg -i cloudflared-linux-arm.deb
```

### 2. Cloudflare Login

```bash
cloudflared tunnel login
```

Ein Browser öffnet sich - autorisiere den Zugriff.

### 3. Tunnel erstellen

```bash
cloudflared tunnel create dnd-session
```

Merke dir die Tunnel-ID (wird angezeigt).

### 4. DNS Route erstellen

```bash
cloudflared tunnel route dns dnd-session dnd.deine-domain.de
```

Ersetze `dnd.deine-domain.de` mit deiner echten (Sub-)Domain.

### 5. Konfigurationsdatei erstellen

Erstelle `~/.cloudflared/config.yml`:

```yaml
tunnel: DEINE_TUNNEL_ID_HIER
credentials-file: /home/pi/.cloudflared/DEINE_TUNNEL_ID_HIER.json

ingress:
  # DnD Session Manager
  - hostname: dnd.deine-domain.de
    service: http://localhost:3001
    originRequest:
      # WebSocket Support für Socket.IO
      noTLSVerify: false
      connectTimeout: 30s
      http2Origin: true

  # Fallback
  - service: http_status:404
```

### 6. Als Service installieren

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

## 🛠️ Verwaltung & Debugging

### Service-Status prüfen

```bash
# Cloudflare Tunnel Status
sudo systemctl status cloudflared

# DnD Session Manager Status
sudo systemctl status dnd-session-manager

# Beide gleichzeitig
sudo systemctl status cloudflared dnd-session-manager
```

### Logs ansehen

```bash
# Cloudflare Tunnel Logs (Live)
sudo journalctl -u cloudflared -f

# DnD Session Manager Logs (Live)
sudo journalctl -u dnd-session-manager -f

# Letzte 50 Zeilen
sudo journalctl -u cloudflared -n 50
```

### Tunnel-Informationen

```bash
# Alle Tunnels auflisten
cloudflared tunnel list

# Info zu einem spezifischen Tunnel
cloudflared tunnel info dnd-session
```

### Tunnel neu starten

```bash
sudo systemctl restart cloudflared
```

### Tunnel stoppen

```bash
sudo systemctl stop cloudflared
```

## 🔍 Troubleshooting

### Problem: "tunnel credentials file not found"

**Lösung:**

```bash
# Prüfe ob die Datei existiert
ls ~/.cloudflared/

# Sollte deine Tunnel-ID.json zeigen
# Falls nicht: Tunnel neu erstellen
cloudflared tunnel create dnd-session-new
```

### Problem: "service unavailable" / 502 Error

**Ursachen & Lösungen:**

1. **DnD Server läuft nicht:**

   ```bash
   sudo systemctl status dnd-session-manager
   sudo systemctl start dnd-session-manager
   ```

2. **Falscher Port in config.yml:**
   - Öffne `~/.cloudflared/config.yml`
   - Stelle sicher dass Port 3001 eingestellt ist

   ```bash
   nano ~/.cloudflared/config.yml
   # Dann: sudo systemctl restart cloudflared
   ```

3. **Server ist nicht auf localhost erreichbar:**
   ```bash
   # Teste von Pi aus
   curl http://localhost:3001
   ```

### Problem: WebSocket-Verbindungen funktionieren nicht

**Lösung:** Stelle sicher dass `http2Origin: true` in der config.yml steht:

```yaml
ingress:
  - hostname: dnd.deine-domain.de
    service: http://localhost:3001
    originRequest:
      http2Origin: true # ← Wichtig für WebSockets!
```

### Problem: DNS zeigt nicht auf Cloudflare

**Lösung:**

```bash
# Route erneut erstellen
cloudflared tunnel route dns dnd-session dnd.deine-domain.de

# Oder in Cloudflare Dashboard manuell CNAME erstellen:
# Name: dnd
# Target: TUNNEL-ID.cfargotunnel.com
```

## 🔐 Sicherheits-Tipps

1. **Login-System nutzen:** Dein Session Manager hat bereits ein Login-System - nutze es!

2. **IP-Whitelist (Optional):** In Cloudflare Dashboard kannst du Zugriff auf bestimmte IP-Adressen beschränken:
   - Cloudflare Dashboard → Access → Create Policy
   - Nur für bestimmte Länder oder IPs erlauben

3. **Rate Limiting:** Schütze vor Brute-Force:
   - Cloudflare Dashboard → Security → WAF
   - Rate Limiting Rule erstellen

4. **Keep Software Updated:**

   ```bash
   # Cloudflared updaten
   sudo apt update && sudo apt upgrade cloudflared

   # Pi System updaten
   sudo apt update && sudo apt upgrade
   ```

## 📊 Performance-Optimierung

### GZIP Kompression aktivieren

Dein Server nutzt bereits `compression` wenn verfügbar. Falls nicht installiert:

```bash
cd ~/dnd-session-manager
npm install compression
sudo systemctl restart dnd-session-manager
```

### HTTP/2 Push (bereits aktiviert)

Die `http2Origin: true` Option in der Tunnel-Config aktiviert HTTP/2 für bessere Performance.

### Cache Headers

Dein Server sendet bereits optimierte Cache-Headers für statische Ressourcen.

## 🎮 Verwendung für Spieler

Teile deinen Spielern einfach die URL:

**Für Spieler:**

```
https://dnd.deine-domain.de/player.html
```

**Für dich (GM):**

```
https://dnd.deine-domain.de
```

**Login-Daten:**

- Standardmäßig: Username "MasterCookie" / Passwort "020266140297"
- **Ändere das Passwort** nach dem ersten Login!

## 📞 Support & weitere Infos

- **Cloudflare Tunnel Docs:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Cloudflared GitHub:** https://github.com/cloudflare/cloudflared
- **Socket.IO mit Cloudflare:** https://socket.io/docs/v4/reverse-proxy/

## 🎲 Viel Spaß beim Spielen!

Deine Spieler können jetzt von überall beitreten - ob vom Handy, Tablet oder PC. Kein VPN, kein Port Forwarding, einfach URL eingeben und loslegen!

---

**Erstellt für:** DnD Session Manager  
**Letztes Update:** April 2026
