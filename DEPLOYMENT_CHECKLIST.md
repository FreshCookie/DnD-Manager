# ✅ Cloudflare Tunnel Deployment - Checkliste

## 📋 Vorbereitung (vor dem Setup)

### 1. Cloudflare Account

- [ ] Kostenlosen Cloudflare Account erstellt: https://dash.cloudflare.com/sign-up
- [ ] Domain in Cloudflare hinzugefügt (oder neue Domain registriert)
- [ ] Nameserver auf Cloudflare umgestellt (falls bestehende Domain)

### 2. Raspberry Pi

- [ ] Pi ist eingerichtet und läuft
- [ ] SSH-Zugriff funktioniert
- [ ] Node.js ist installiert (wird vom Script gemacht falls nicht)
- [ ] IP-Adresse des Pi bekannt: `_____________`

### 3. Projekt-Dateien

- [ ] Alle Dateien sind aktuell
- [ ] `.env` Datei erstellt (falls benötigt)
- [ ] Musik-/Bild-Dateien sind auf dem Pi (optional)

## 🚀 Deployment-Schritte

### Schritt 1: Projekt auf Pi übertragen

**Auf deinem Windows-PC (PowerShell):**

```powershell
# Ersetze <PI-IP> mit der echten IP
$PI_IP = "192.168.x.x"

# Projekt hochladen
rsync -av --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ pi@${PI_IP}:~/dnd-session-manager/
```

- [ ] Dateien erfolgreich übertragen
- [ ] Keine Fehler beim Upload

### Schritt 2: DnD Session Manager einrichten

**SSH zum Pi:**

```bash
ssh pi@<PI-IP>
cd ~/dnd-session-manager
chmod +x pi-setup.sh
./pi-setup.sh
```

**Das Script wird:**

- Node.js installieren (falls nicht vorhanden)
- Dependencies installieren (`npm install`)
- Production Build erstellen (`npm run build`)
- Systemd Service einrichten
- Service starten

- [ ] Script ohne Fehler durchgelaufen
- [ ] Service läuft: `sudo systemctl status dnd-session-manager`
- [ ] Lokaler Zugriff funktioniert: http://<PI-IP>:3001

### Schritt 3: Cloudflare Tunnel einrichten

**Auf dem Pi:**

```bash
./setup-cloudflare-tunnel.sh
```

**Das Script fragt nach:**

1. **Cloudflare Login**
   - [ ] Browser öffnet sich (oder Link kopieren)
   - [ ] Mit Cloudflare Account eingeloggt
   - [ ] Zugriff autorisiert

2. **Tunnel-Name**
   - Vorschlag: `dnd-session`
   - [ ] Name eingegeben: `_____________`

3. **Domain/Subdomain**
   - Beispiel: `dnd.example.com`
   - [ ] Domain eingegeben: `_____________`

- [ ] Tunnel wurde erstellt
- [ ] DNS Route wurde konfiguriert
- [ ] Service läuft: `sudo systemctl status cloudflared`

### Schritt 4: Testen

**Remote-Zugriff testen:**

- [ ] GM View öffnet sich: https://deine-domain.de
- [ ] Player View funktioniert: https://deine-domain.de/player.html
- [ ] HTTPS (grünes Schloss) ist aktiv
- [ ] Login funktioniert
- [ ] Echtzeit-Updates funktionieren (Test mit 2 Browsern)

**Von externem Netzwerk testen:**

- [ ] Mit Handy (Mobile Data) getestet
- [ ] Von anderem Ort/Netzwerk getestet

## 🔐 Sicherheit

### Login-Daten ändern

- [ ] Standard-Passwort geändert (MasterCookie / 020266140297)
- [ ] Neues Passwort sicher gespeichert

### Firewall (optional, aber empfohlen)

```bash
# UFW installieren und konfigurieren
sudo apt install ufw
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 3001/tcp    # DnD Manager (nur im lokalen Netzwerk)
sudo ufw enable
```

- [ ] Firewall aktiviert (optional)

### Cloudflare Security (optional)

Im Cloudflare Dashboard:

- [ ] Rate Limiting aktiviert (gegen Brute-Force)
- [ ] Bot Protection aktiviert
- [ ] Geo-Blocking konfiguriert (nur Deutschland erlauben?)

## 📝 Dokumentation

### Wichtige Infos notieren

```
Domain:           _______________________
Tunnel-Name:      _______________________
Pi IP-Adresse:    _______________________
GM Login:         _______________________
GM Passwort:      _______________________
```

### Spielern mitteilen

**Für Spieler kopieren & anpassen:**

```
🎲 DnD Session Manager - Zugriff

Hey Leute! Unser Session Manager ist online!

Player View: https://deine-domain.de/player.html

Öffnet den Link wenn wir spielen, dann seht ihr alles
was ich euch zeige in Echtzeit!

Funktioniert auf PC, Tablet und Handy.

Bis zur nächsten Session! 🐉
```

- [ ] Info an Spieler verschickt

## 🔄 Backup-Strategie

### Automatisches Backup einrichten (optional)

**Auf deinem PC (PowerShell Script):**

```powershell
# backup.ps1
$PI_IP = "192.168.x.x"
$DATE = Get-Date -Format "yyyy-MM-dd"
$BACKUP_DIR = ".\backups\$DATE"

New-Item -ItemType Directory -Force -Path $BACKUP_DIR
rsync -av pi@${PI_IP}:~/dnd-session-manager/data/ $BACKUP_DIR
Write-Host "✅ Backup erstellt: $BACKUP_DIR"
```

- [ ] Backup-Script erstellt
- [ ] Test-Backup durchgeführt
- [ ] Backup-Ordner angelegt

## 🐛 Troubleshooting

### Häufige Probleme

**Service startet nicht:**

```bash
sudo journalctl -u dnd-session-manager -n 50
```

- [ ] Logs geprüft

**Cloudflare Tunnel verbindet nicht:**

```bash
sudo journalctl -u cloudflared -n 50
cloudflared tunnel list
```

- [ ] Tunnel existiert
- [ ] Credentials-Datei vorhanden

**502 Bad Gateway:**

- [ ] DnD Service läuft
- [ ] Port 3001 ist korrekt
- [ ] Config.yml ist richtig

## ✨ Optional: Erweiterte Features

### Monitoring einrichten

- [ ] Uptime-Monitor (z.B. UptimeRobot) konfiguriert
- [ ] Email-Benachrichtigung bei Ausfall

### Performance-Optimierung

- [ ] GZIP Kompression aktiviert (wird automatisch gemacht)
- [ ] Cache-Headers optimiert (bereits im Code)

### Updates automatisieren

- [ ] Auto-Update Script erstellt
- [ ] Cronjob für regelmäßige Updates

## 🎉 Abschluss

- [ ] **Alles funktioniert!**
- [ ] **Spieler können connecten**
- [ ] **Backup-Strategie steht**
- [ ] **Dokumentation abgelegt**

---

## 📞 Support-Kontakte

**Bei Problemen:**

1. **Quick Reference:** `QUICK_REFERENCE.md`
2. **Tunnel-Doku:** `CLOUDFLARE_TUNNEL_SETUP.md`
3. **Cloudflare Support:** https://support.cloudflare.com
4. **Logs prüfen:**
   - DnD: `sudo journalctl -u dnd-session-manager -f`
   - Tunnel: `sudo journalctl -u cloudflared -f`

---

**🎲 Viel Erfolg beim Deployment und viel Spaß beim Spielen!**

_Letztes Update: April 2026_
