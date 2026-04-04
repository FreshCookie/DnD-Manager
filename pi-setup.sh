#!/bin/bash
# Quick Setup Script für Raspberry Pi
# Führe dieses Skript auf dem Pi aus, nachdem du das Projekt hochgeladen hast

echo "🎲 DnD Session Manager - Raspberry Pi Quick Setup"
echo "=================================================="
echo ""

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo "📥 Installiere Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js $(node --version) gefunden"
fi

echo ""
echo "📦 Installiere Dependencies..."
npm install

echo ""
echo "🏗️  Erstelle Production Build..."
npm run build

echo ""
echo "🔧 Richte Systemd Service ein..."
sudo tee /etc/systemd/system/dnd-session-manager.service > /dev/null <<EOF
[Unit]
Description=DnD Session Manager
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment="NODE_ENV=production"
Environment="PORT=3001"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "🚀 Aktiviere und starte Service..."
sudo systemctl daemon-reload
sudo systemctl enable dnd-session-manager
sudo systemctl start dnd-session-manager

echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "📊 Service Status:"
sudo systemctl status dnd-session-manager --no-pager -l

echo ""
echo "🌐 Zugriff:"
echo "   - GM View:        http://$(hostname -I | awk '{print $1}'):3001"
echo "   - Player View:    http://$(hostname -I | awk '{print $1}'):3001/player.html"
echo "   - Hexagon View:   http://$(hostname -I | awk '{print $1}'):3001/hexagon-player.html"
echo ""
echo "💡 Nützliche Befehle:"
echo "   - Status:         sudo systemctl status dnd-session-manager"
echo "   - Logs:           sudo journalctl -u dnd-session-manager -f"
echo "   - Neu starten:    sudo systemctl restart dnd-session-manager"
echo "   - Stoppen:        sudo systemctl stop dnd-session-manager"
