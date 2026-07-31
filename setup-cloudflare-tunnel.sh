#!/bin/bash
# Cloudflare Tunnel Setup für DnD Session Manager
# Dieses Script richtet Cloudflare Tunnel auf dem Raspberry Pi ein

set -e  # Beende bei Fehlern

echo "🌐 Cloudflare Tunnel Setup für DnD Session Manager"
echo "===================================================="
echo ""

# Farbcodes für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prüfe ob Script als Root läuft (für Installation)
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Bitte NICHT als Root ausführen!${NC}"
   echo "Das Script verwendet sudo wo nötig."
   exit 1
fi

# 1. Prüfe ob cloudflared bereits installiert ist
echo -e "${BLUE}📦 Schritt 1/6: Prüfe cloudflared Installation...${NC}"
if ! command -v cloudflared &> /dev/null; then
    echo "cloudflared nicht gefunden, installiere..."
    
    # Für Raspberry Pi (ARM64)
    if [ "$(uname -m)" = "aarch64" ]; then
        echo "ARM64 erkannt, installiere für Raspberry Pi..."
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
        sudo dpkg -i cloudflared-linux-arm64.deb
        rm cloudflared-linux-arm64.deb
    # Für Raspberry Pi (ARM 32-bit)
    elif [ "$(uname -m)" = "armv7l" ]; then
        echo "ARM 32-bit erkannt, installiere für Raspberry Pi..."
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.deb
        sudo dpkg -i cloudflared-linux-arm.deb
        rm cloudflared-linux-arm.deb
    else
        echo -e "${RED}❌ Unbekannte Architektur: $(uname -m)${NC}"
        echo "Bitte cloudflared manuell installieren: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
        exit 1
    fi
    
    echo -e "${GREEN}✅ cloudflared installiert${NC}"
else
    echo -e "${GREEN}✅ cloudflared $(cloudflared --version | head -n1) bereits installiert${NC}"
fi

echo ""
echo -e "${BLUE}📦 Schritt 2/6: Cloudflare Login${NC}"
echo ""
echo -e "${YELLOW}⚠️  WICHTIG:${NC}"
echo "   1. Ein Browser-Fenster wird sich öffnen (oder du bekommst einen Link)"
echo "   2. Logge dich mit deinem Cloudflare Account ein"
echo "   3. Autorisiere den Zugriff"
echo ""
read -p "Drücke Enter um fortzufahren..."
cloudflared tunnel login

echo ""
echo -e "${GREEN}✅ Login erfolgreich${NC}"

echo ""
echo -e "${BLUE}📦 Schritt 3/6: Tunnel erstellen${NC}"
echo ""
read -p "Gib einen Namen für deinen Tunnel ein (z.B. 'dnd-session'): " TUNNEL_NAME

if [ -z "$TUNNEL_NAME" ]; then
    TUNNEL_NAME="dnd-session"
    echo "Verwende Standard-Namen: $TUNNEL_NAME"
fi

cloudflared tunnel create $TUNNEL_NAME

# Finde die Tunnel-ID
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')
echo -e "${GREEN}✅ Tunnel erstellt: $TUNNEL_ID${NC}"

echo ""
echo -e "${BLUE}📦 Schritt 4/6: DNS Route konfigurieren${NC}"
echo ""
echo "Deine registrierten Domains:"
cloudflared tunnel route dns --help 2>&1 | grep -A 5 "DOMAIN" || echo "(Keine gefunden - stelle sicher dass du eine Domain in Cloudflare hast)"
echo ""
read -p "Gib deine Domain ein (z.B. 'dnd.example.com'): " HOSTNAME

if [ -z "$HOSTNAME" ]; then
    echo -e "${RED}❌ Hostname ist erforderlich!${NC}"
    exit 1
fi

cloudflared tunnel route dns $TUNNEL_NAME $HOSTNAME
echo -e "${GREEN}✅ DNS Route erstellt: $HOSTNAME -> $TUNNEL_NAME${NC}"

echo ""
echo -e "${BLUE}📦 Schritt 5/6: Konfigurationsdatei erstellen${NC}"

# Erstelle config.yml
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /home/$USER/.cloudflared/$TUNNEL_ID.json

ingress:
  # DnD Session Manager
  - hostname: $HOSTNAME
    service: http://localhost:3001
    originRequest:
      # WebSocket Support für Socket.IO
      noTLSVerify: false
      connectTimeout: 30s
      http2Origin: true
  
  # Fallback
  - service: http_status:404
EOF

echo -e "${GREEN}✅ Konfiguration erstellt: ~/.cloudflared/config.yml${NC}"

echo ""
echo -e "${BLUE}📦 Schritt 6/6: Systemd Service einrichten${NC}"

# Installiere als Service
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

echo ""
echo -e "${GREEN}✅✅✅ Setup abgeschlossen! ✅✅✅${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Dein DnD Session Manager ist jetzt online!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📍 Zugriff von überall:${NC}"
echo "   GM View:        https://$HOSTNAME"
echo "   Player View:    https://$HOSTNAME/player.html"
echo "   Hexagon View:   https://$HOSTNAME/hexagon-player.html"
echo ""
echo -e "${BLUE}💡 Nützliche Befehle:${NC}"
echo "   Status:         sudo systemctl status cloudflared"
echo "   Logs:           sudo journalctl -u cloudflared -f"
echo "   Neu starten:    sudo systemctl restart cloudflared"
echo "   Stoppen:        sudo systemctl stop cloudflared"
echo ""
echo "   Tunnel Info:    cloudflared tunnel info $TUNNEL_NAME"
echo "   Liste Tunnels:  cloudflared tunnel list"
echo ""
echo -e "${YELLOW}⚠️  Wichtig:${NC}"
echo "   - Stelle sicher dass dein DnD Session Manager Service läuft:"
echo "     sudo systemctl status dnd-session-manager"
echo "   - HTTPS wird automatisch von Cloudflare bereitgestellt!"
echo "   - WebSocket-Verbindungen funktionieren automatisch"
echo ""
