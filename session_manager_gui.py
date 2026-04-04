import customtkinter as ctk
import subprocess
import threading
import time
import requests
import socket
from datetime import datetime
import json
import os
import signal

class DnDSessionManager:
    def __init__(self):
        # Haupt-Fenster Setup
        self.root = ctk.CTk()
        self.root.title("🎲 DnD Session Manager - Control Center")
        self.root.geometry("750x800")
        self.root.minsize(700, 750)
        
        # Dark Theme
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        # Prozess-Tracking
        self.processes = {
            "backend": None,
            "vite": None,
            "ngrok": None
        }
        
        # Status
        self.status = {
            "backend": "stopped",
            "vite": "stopped",
            "ngrok": "stopped"
        }
        
        self.ngrok_url = "Warte auf Tunnel..."
        self.is_running = False
        self.monitoring_thread = None
        
        self.setup_ui()
        
    def setup_ui(self):
        # Header
        header = ctk.CTkFrame(self.root, fg_color="#1a1a2e", corner_radius=0)
        header.pack(fill="x", padx=0, pady=0)
        
        title = ctk.CTkLabel(
            header, 
            text="🎲 DnD SESSION MANAGER",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00ff88"
        )
        title.pack(pady=15)
        
        subtitle = ctk.CTkLabel(
            header,
            text="Server Control Center",
            font=ctk.CTkFont(size=12),
            text_color="#888888"
        )
        subtitle.pack(pady=(0, 10))
        
        # Main Content
        content = ctk.CTkFrame(self.root, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=20, pady=20)
        
        # === Service Status Cards ===
        self.create_service_card(content, "Backend Server", "backend", "Port 3001")
        self.create_service_card(content, "Vite Dev Server", "vite", "Port 5173")
        self.create_service_card(content, "Ngrok Tunnel", "ngrok", "Public Access")
        
        # Ngrok URL Display
        ngrok_frame = ctk.CTkFrame(content, fg_color="#1e1e1e", corner_radius=10)
        ngrok_frame.pack(fill="x", pady=(10, 0))
        
        ctk.CTkLabel(
            ngrok_frame,
            text="📡 Ngrok Public URL:",
            font=ctk.CTkFont(size=12, weight="bold")
        ).pack(side="left", padx=15, pady=10)
        
        self.ngrok_url_label = ctk.CTkLabel(
            ngrok_frame,
            text=self.ngrok_url,
            font=ctk.CTkFont(size=11),
            text_color="#00aaff"
        )
        self.ngrok_url_label.pack(side="left", padx=5, pady=10)
        
        # Log Window
        log_label = ctk.CTkLabel(
            content,
            text="📋 System Log",
            font=ctk.CTkFont(size=14, weight="bold"),
            anchor="w"
        )
        log_label.pack(fill="x", pady=(15, 5))
        
        self.log_text = ctk.CTkTextbox(
            content,
            height=150,
            fg_color="#1e1e1e",
            font=ctk.CTkFont(size=11)
        )
        self.log_text.pack(fill="both", expand=True)
        self.log_text.configure(state="disabled")
        
        # Control Buttons
        button_frame = ctk.CTkFrame(content, fg_color="transparent")
        button_frame.pack(fill="x", pady=(15, 0))
        
        self.start_button = ctk.CTkButton(
            button_frame,
            text="🚀 START ALL SERVICES",
            command=self.start_all_threaded,
            height=45,
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#00cc66",
            hover_color="#00aa55"
        )
        self.start_button.pack(side="left", expand=True, padx=(0, 10))
        
        self.stop_button = ctk.CTkButton(
            button_frame,
            text="⏹️ STOP ALL SERVICES",
            command=self.stop_all_threaded,
            height=45,
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#cc3333",
            hover_color="#aa2222",
            state="disabled"
        )
        self.stop_button.pack(side="left", expand=True)
        
        self.log("System initialisiert - Bereit zum Start")
        
    def create_service_card(self, parent, name, service_id, port_info):
        frame = ctk.CTkFrame(parent, fg_color="#1e1e1e", corner_radius=10)
        frame.pack(fill="x", pady=5)
        
        # Status Indicator - Echter farbiger LED-Kreis
        indicator_container = ctk.CTkFrame(frame, fg_color="transparent", width=40, height=40)
        indicator_container.pack(side="left", padx=(15, 10), pady=12)
        indicator_container.pack_propagate(False)
        
        status_indicator = ctk.CTkFrame(
            indicator_container,
            width=20,
            height=20,
            corner_radius=10,  # Macht es rund
            fg_color="#cc3333"  # Rot = stopped
        )
        status_indicator.place(relx=0.5, rely=0.5, anchor="center")
        
        # Service Info
        info_frame = ctk.CTkFrame(frame, fg_color="transparent")
        info_frame.pack(side="left", fill="x", expand=True, pady=12)
        
        ctk.CTkLabel(
            info_frame,
            text=name,
            font=ctk.CTkFont(size=14, weight="bold"),
            anchor="w"
        ).pack(anchor="w")
        
        ctk.CTkLabel(
            info_frame,
            text=port_info,
            font=ctk.CTkFont(size=11),
            text_color="#888888",
            anchor="w"
        ).pack(anchor="w")
        
        # Store reference
        setattr(self, f"{service_id}_indicator", status_indicator)
        
    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.log_text.configure(state="normal")
        self.log_text.insert("end", log_message)
        self.log_text.see("end")
        self.log_text.configure(state="disabled")
        
    def check_port(self, port):
        """Prüft ob Port wirklich antwortet"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                result = s.connect_ex(('localhost', port))
                return result == 0
        except:
            return False
            
    def get_ngrok_url(self):
        """Holt Ngrok URL von der lokalen API"""
        try:
            response = requests.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
            data = response.json()
            if data.get("tunnels"):
                for tunnel in data["tunnels"]:
                    if tunnel.get("proto") == "https":
                        return tunnel.get("public_url")
            return "Tunnel nicht verfügbar"
        except:
            return "Warte auf Ngrok..."
            
    def update_status(self, service, status):
        """Aktualisiert Status-Indicator mit echten Farben"""
        self.status[service] = status
        indicator = getattr(self, f"{service}_indicator")
        
        if status == "running":
            indicator.configure(fg_color="#00cc66")  # Grün
        elif status == "starting":
            indicator.configure(fg_color="#ffaa00")  # Gelb/Orange
        else:
            indicator.configure(fg_color="#cc3333")  # Rot
            
    def monitor_services(self):
        """Background Thread für Service-Monitoring"""
        while self.is_running:
            # Backend Check
            if self.check_port(3001):
                self.update_status("backend", "running")
            elif self.processes["backend"] and self.processes["backend"].poll() is None:
                self.update_status("backend", "starting")
            else:
                self.update_status("backend", "stopped")
                
            # Vite Check
            if self.check_port(5173):
                self.update_status("vite", "running")
            elif self.processes["vite"] and self.processes["vite"].poll() is None:
                self.update_status("vite", "starting")
            else:
                self.update_status("vite", "stopped")
                
            # Ngrok Check
            ngrok_url = self.get_ngrok_url()
            if ngrok_url.startswith("http"):
                self.update_status("ngrok", "running")
                self.ngrok_url = ngrok_url
                self.ngrok_url_label.configure(text=ngrok_url)
            elif self.processes["ngrok"] and self.processes["ngrok"].poll() is None:
                self.update_status("ngrok", "starting")
                self.ngrok_url_label.configure(text="Warte auf Tunnel...")
            else:
                self.update_status("ngrok", "stopped")
                self.ngrok_url_label.configure(text="Nicht aktiv")
                
            time.sleep(3)  # Check alle 3 Sekunden
    
    def wait_for_port(self, port, timeout=30, service_name="Service"):
        """Wartet bis ein Port antwortet"""
        self.log(f"⏳ Warte auf {service_name} (Port {port})...")
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.check_port(port):
                self.log(f"✓ {service_name} ist bereit!")
                return True
            time.sleep(0.5)
        
        self.log(f"⚠️ {service_name} antwortet nicht nach {timeout}s")
        return False
    
    def start_all_threaded(self):
        """Wrapper für Thread-sicheres Starten"""
        self.start_button.configure(state="disabled")
        threading.Thread(target=self.start_all, daemon=True).start()
            
    def start_all(self):
        """Startet alle Services sequentiell mit Wartezeit"""
        self.log("🚀 Starte alle Services sequentiell...")
        self.is_running = True
        
        # Backend starten und warten
        self.log("1️⃣ Backend Server wird gestartet...")
        self.update_status("backend", "starting")
        self.processes["backend"] = subprocess.Popen(
            "node server.js",
            shell=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        if self.wait_for_port(3001, timeout=15, service_name="Backend"):
            self.update_status("backend", "running")
        else:
            self.log("❌ Backend konnte nicht gestartet werden!")
        
        # Vite starten und warten
        self.log("2️⃣ Vite Dev Server wird gestartet...")
        self.update_status("vite", "starting")
        self.processes["vite"] = subprocess.Popen(
            "npm run dev",
            shell=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        if self.wait_for_port(5173, timeout=30, service_name="Vite"):
            self.update_status("vite", "running")
        else:
            self.log("❌ Vite konnte nicht gestartet werden!")
        
        # Ngrok starten und warten
        self.log("3️⃣ Ngrok Tunnel wird gestartet...")
        self.update_status("ngrok", "starting")
        self.processes["ngrok"] = subprocess.Popen(
            "npx ngrok http 5173",
            shell=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        # Warte auf Ngrok URL (kann bis zu 10 Sekunden dauern)
        self.log("⏳ Warte auf Ngrok Tunnel...")
        ngrok_ready = False
        for i in range(20):  # 20 * 0.5s = 10 Sekunden
            time.sleep(0.5)
            url = self.get_ngrok_url()
            if url.startswith("http"):
                self.update_status("ngrok", "running")
                self.ngrok_url_label.configure(text=url)
                self.log(f"✓ Ngrok bereit: {url}")
                ngrok_ready = True
                break
        
        if not ngrok_ready:
            self.log("⚠️ Ngrok braucht noch etwas Zeit...")
        
        # Monitoring starten
        self.monitoring_thread = threading.Thread(target=self.monitor_services, daemon=True)
        self.monitoring_thread.start()
        
        self.stop_button.configure(state="normal")
        self.log("✅ Alle Services gestartet - Monitoring aktiv")
    
    def stop_all_threaded(self):
        """Wrapper für Thread-sicheres Stoppen"""
        self.stop_button.configure(state="disabled")
        threading.Thread(target=self.stop_all, daemon=True).start()
        
    def stop_all(self):
        """Stoppt alle Services sequentiell"""
        self.log("⏹️ Stoppe alle Services...")
        self.is_running = False
        
        # Stoppe in umgekehrter Reihenfolge: Ngrok → Vite → Backend
        services_order = ["ngrok", "vite", "backend"]
        
        for service in services_order:
            process = self.processes.get(service)
            if process and process.poll() is None:
                self.log(f"⏹️ Stoppe {service.capitalize()}...")
                self.update_status(service, "stopped")
                
                try:
                    # Versuche graceful shutdown
                    process.terminate()
                    
                    # Warte bis zu 5 Sekunden
                    for i in range(10):
                        if process.poll() is not None:
                            self.log(f"✓ {service.capitalize()} gestoppt")
                            break
                        time.sleep(0.5)
                    else:
                        # Falls noch läuft, force kill
                        self.log(f"⚠️ {service.capitalize()} antwortet nicht - Force Kill")
                        process.kill()
                        process.wait()
                        
                except Exception as e:
                    self.log(f"❌ Fehler beim Stoppen von {service}: {str(e)}")
                    try:
                        process.kill()
                    except:
                        pass
                
        self.processes = {"backend": None, "vite": None, "ngrok": None}
        self.ngrok_url_label.configure(text="Nicht aktiv")
        
        self.start_button.configure(state="normal")
        self.log("✅ Alle Services gestoppt")
        
    def on_closing(self):
        """Cleanup beim Fenster schließen"""
        if self.is_running:
            self.stop_all()
        self.root.destroy()
        
    def run(self):
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.root.mainloop()

if __name__ == "__main__":
    app = DnDSessionManager()
    app.run()
