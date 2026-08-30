# DnD Session Manager – Projekt-Doku

> Globale Verhaltensregeln stehen in `~/.Codex/AGENTS.md`. Hier nur Projektwissen.

## Was ist das?

- Web-Tool für D&D-Sessions der Gruppe **"Wietzendorf Landnerds"** (DM = `MasterCookie`).
- Drei Zielgruppen in einer App: **Landing Page** (Gruppen-Website), **GM View** (Session-Steuerung), **Player View** (was Spieler live sehen).
- Läuft produktiv auf einem **Raspberry Pi**, von außen erreichbar per **Cloudflare Tunnel**.
- Echtzeit-Sync GM → Spieler über **Socket.IO**. Persistenz: **flache JSON-Dateien** in `data/` (keine DB).

## Stack

- React 19 + Vite 5 + Tailwind 3 (CDN-Tailwind nur in `public/player.html`), lucide-react Icons
- Express 4 + Socket.IO 4, bcryptjs, cookie-parser, compression
- Kein TypeScript, kein Test-Setup. ESLint via `npm run lint`.

## Einstiegspunkte / Vite-Multipage

`vite.config.js` baut 4 HTML-Entries:

| Entry | HTML | JS-Root | Inhalt |
|---|---|---|---|
| landing | [landing.html](landing.html) | [src/landing-main.jsx](src/landing-main.jsx) | LandingPage (Website) |
| main | [index.html](index.html) | [src/main.jsx](src/main.jsx) | App → Login/GM/Player |
| player | [public/player.html](public/player.html) | [src/player-main.jsx](src/player-main.jsx) | reine PlayerView (Beamer/2. Screen) |
| hexagonPlayer | [public/hexagon-player.html](public/hexagon-player.html) | [src/hexagon-player.jsx](src/hexagon-player.jsx) | Hex-Map für Spieler |

Dev: Vite auf 5173 (Proxy `/api` → 3001). Prod: `NODE_ENV=production`, Express serviert `dist/`; `/` → landing.html, `/session` oder `/gm` → index.html.

## App-Flow (src/App.jsx)

`AuthProvider` → nicht eingeloggt: `LoginScreen`
- **role player** → `CharacterSelector` → `PlayerView` (mit `PlayerSideMenu`)
- **role gm** → `StartScreen` (1 Karte, ESC = zurück) → `penandpaper` → `DataProvider` → `PenAndPaperMode` → `PreloadScreen` → `GMView`

⚠️ **Seit 2026-07-31 entfernt:** 18+-Modus (`DataContext18Plus`, `GMView18Plus`, `PenAndPaperMode18Plus`, `KinksReferenceLibrary`) und Hexagon-Modus (`HexagonContext`, `HexagonGMView`, `HexagonPlayerView`, `HexGrid`, `Hexagon`, `ExplorationPanel`, `MovementPanel`, `ItemDatabase`, `PlayerManagement`, `PlayerEditModal`, `SkillTreeModal`, `hexHelpers.js`, `playerHelpers.js`, `hexagon-player.jsx`/`.html`) waren unfertige, verworfene Ideen – komplett gelöscht, ebenso `/api/data-18plus` und `/api/reference-data` in server.js. **Bewusst NICHT gelöscht:** `data/session-data-18plus.json` und `data/reference-data.json` liegen weiterhin ungenutzt in `data/` (auf expliziten Wunsch, kein Löschrisiko).

## Contexts

- **[AuthContext](src/contexts/AuthContext.jsx)** – Login/Register/JoinSession/Logout, `logoutAllPlayers`, `getOnlinePlayers`. Session per httpOnly-Cookie `sessionId` + Spiegelung in localStorage (`dnd-session-id`, `dnd-user`, `dnd-character`); beim Start `verify-session`.
- **[DataContext](src/contexts/DataContext.jsx)** – Kern des Pen&Paper-Modus. Lädt `/api/data`, hält cities/stories/npcs/locations/subLocations/items/intros/players/companions/activePlayers/sessionTimes/theme. **Auto-Save 1 s debounced auf JEDE State-Änderung** (POST `/api/data`), Fallback + Backup in localStorage `dnd-session-data`. Migration alter `description`-Strings → `descriptions[]`-Array (mit `showToPlayers`). `sendToPlayerView(data)` emitted `gm:update-playerview`.
- **[DataContext18Plus](src/contexts/DataContext18Plus.jsx)** – identisch, aber gegen `/api/data-18plus`.
- **[HexagonContext](src/contexts/HexagonContext.jsx)** – **rein im Speicher, keine Persistenz.** Generiert Hex-Grid Radius 12 (397 Hexes), Spielzeit in Minuten, 4 Default-Spieler.

## GM View Tabs ([GMView.jsx](src/components/GMView.jsx))

Übersicht (CitySelector+StoryList) · Storys · D Rektor (Intros) · Locations & NPCs · Items · Spieler · Companions · Online Spieler · Inventar-Anfragen.
Rechte Spalte immer: SessionTimer, SessionNotes, ChallengeTimer, CurrentDisplayIndicator, DiceRoller, MusicPlayer, ThemeSelector.
Größte Komponente: [LocationWithNPCs.jsx](src/components/LocationWithNPCs.jsx) (~2100 Z.) – Locations → SubLocations → NPCs, Mehrfachbilder, Prioritäten, `DescriptionManager` (GM-Notiz vs. „an Spieler zeigen").

## Player View

- [PlayerView.jsx](src/components/PlayerView.jsx) – Socket-Empfänger. Rendert nach `displayData.type`: `npc`, `location`, `subLocation`, `both`, `item`, `intro`, `kinksReference`, `clear` (Warte-Screen mit rotierenden Tooltips aus `public/Tooltips/Tooltip_List.txt`, Wechsel alle 30 s). Bildfehler gehen per `player:image-error` zurück an den GM (Alert).
- [PlayerSideMenu.jsx](src/components/PlayerSideMenu.jsx) (~1600 Z.) – Tabs: Mein Charakter · Bearbeiten · Fähigkeiten · Notizen · Inventar. Inventar-Änderungen von Spielern sind **Anträge**, die der GM freigibt.

## Landing Page ([src/components/landing/](src/components/landing/))

Login-Pflicht (`LandingLogin`) → Tabs: Home · Kampagnen · **Chars** (iframe auf `/chars`) · Events · Über uns · Gallery (Platzhalter). `AdminPanel` (nur GM) editiert siteInfo/gameMasters/campaigns/events/about. Footer: Impressum/Datenschutz/AGB (statische HTML in `public/`). Daten: `data/landing-data.json`.

## Char Manifest

- **Seit 2026-07-31 React-Komponente** unter [src/components/charmanifest/](src/components/charmanifest/) (`CharManifest`, `CharRoster`, `AdminCharRoster`, `CharSheet`, `EditableList`, `charApi.js`), eingebunden direkt im "Chars"-Tab der [LandingPage](src/components/landing/LandingPage.jsx) (kein iframe mehr).
- Ersetzt die alte Vanilla-JS-Seite `public/chars.html` (gelöscht) samt der Server-Route `/chars`, die sie auslieferte (ebenfalls entfernt). Die REST-API (`/api/chars[/:id]`, `/api/admin/chars-overview`, `/api/admin/chars/:userId/:charId`) und das Speicherformat (`data/chars/<userId>/<charId>.json` + `_list.json`) sind **unverändert** – rein UI-seitiger Umbau, bestehende Charakterdaten bleiben kompatibel.
- **Ursache des früheren Datenverlust-Bugs behoben:** Die alte Seite cachte Liste/Charaktere 5 Minuten in localStorage und schrieb bei jeder Änderung diesen (ggf. veralteten) Stand zurück auf den Server – bei Nutzung von mehreren Geräten/Tabs gingen dadurch Charaktere/Änderungen verloren. Die neue Implementierung cached nichts und liest vor jeder Listen-Mutation (Charakter anlegen/löschen) immer frisch vom Server.
- Speicherverhalten: Buttons/Listen/Fotos speichern sofort, Text-/Zahlenfelder beim Verlassen des Feldes (`onBlur`), zusätzlich manueller Save-Button + Strg+S.
- [char_manifest/](char_manifest/) ist weiterhin der **alte Standalone-Prototyp** (eigener Express auf Port 3000, ohne Auth) – nicht mehr aktiv, nur Referenz.
- ⚠️ Noch nicht lokal getestet (in dieser Session war kein Node/npm im Terminal auffindbar) – vor produktivem Einsatz einmal `npm run dev` durchklicken.

## Backend ([server.js](server.js), ~2100 Z.)

Alles synchron per `fs.readFileSync`/`writeFileSync`, kein Locking.

- `GET/POST /api/data`, `/api/data-18plus`, `GET /api/reference-data`
- `GET/POST /api/landing-data`, `POST/PUT/DELETE /api/landing/sessions[/:id]`
- Auth: `/api/auth/login`, `/register`, `/join-session`, `/logout`, `/logout-all`, `/online-players`, `/verify-session`
- Charaktere: `PUT /api/characters/:id`; Notizen, Abilities, Inventory je als CRUD unter `/api/characters/:characterId/...`
- Inventar-Workflow: `POST .../inventory-changes` (Spieler) → `GET /api/inventory-changes/pending` → `PUT /api/inventory-changes/:id/approve|reject` (GM)
- Chars-Routes (s. o.), Legal-Pages, Static-Serving mit Cache-Headern (assets 7 d immutable, images 1 d, music 7 d)
- Socket.IO: nur ein Event-Paar – GM `gm:update-playerview` → Broadcast `player:playerview-update`

Autorisierung durchgängig über `sessionId`-Cookie → `data/active-sessions.json`; Spieler dürfen nur ihren eigenen `session.character`, GM alles. Inventar direkt bearbeiten = nur GM.

## Datendateien (`data/`) — KRITISCH

| Datei | Inhalt |
|---|---|
| `session-data.json` | **Hauptdatei (~140 KB).** Aktuell: 2 cities, 7 stories, 24 locations, 54 subLocations, 123 npcs, 4 items, 3 intros, 9 players, 8 companions, sessionTimes, theme |
| `session-data-BACKUP-2026-04-10_12-29.json` | Backup-Kopie |
| `session-data-18plus.json` | 18+-Modus (aktuell leer) |
| `reference-data.json` | K&C-Referenz: kinks/classes/races/creatures/mechanics |
| `landing-data.json` | Website-Inhalte |
| `users.json` | Accounts (bcrypt). Aktuell nur `gm_mastercookie` |
| `active-sessions.json` | Laufende Sessions |
| `chars/<userId>/*.json` | Char-Manifest-Bögen |

**Datensicherheits-Regeln für dieses Projekt:**
- Diese Dateien sind Monate an Session-Arbeit → nie ohne einzelne, ausdrückliche Bestätigung schreiben/löschen/migrieren. Vorher immer zusammenfassen, was passieren würde.
- ⚠️ **`npm run build` schreibt in `data/users.json`!** [copy-public-assets.js](copy-public-assets.js) überschreibt den `passwordHash` von MasterCookie mit einem im Skript hartcodierten Passwort. Vor jedem Build bedenken.
- ⚠️ DataContext speichert **1 Sekunde nach jeder State-Änderung** automatisch die komplette `session-data.json`. Ein Bug im State = sofortiger Datenverlust in der Datei. Änderungen an Contexts/Save-Logik besonders vorsichtig.
- Legacy-Duplikate in `src/data/` (`session-data.json` ist leer, `reference-data.json` Kopie) werden **nicht** verwendet – Quelle ist immer `data/`.

## Deployment

**Produktiv läuft alles auf einem gemieteten KVM-VServer, NICHT mehr auf dem Raspberry Pi** (Pi war leistungsmäßig an seiner Grenze, da mittlerweile viel mehr darauf lief). Der Pi-Bezug in README/QUICK_REFERENCE/RASPBERRY_PI_SETUP.md etc. ist historisch/veraltet.

- **VServer:** `kvm16549.bero-host.de` (109.71.253.246), Debian 13, 2 vCPU/4 GB RAM/50 GB NVMe, Anbieter bero-host.de. Tägliches Backup ist aktiviert (21 Uhr).
- **App-Pfad:** `/home/dnd/DnD-Manager`, läuft als User `dnd` über systemd-Service `dnd-session-manager` (Port 3001), `NODE_ENV=production`.
- **Cloudflare Tunnel** läuft als eigener systemd-Service `cloudflared` auf dem VServer.
- **Deployment-Mechanismus:** `git clone`/`pull` von `https://github.com/FreshCookie/DnD-Manager.git` — **kein rsync des kompletten Ordners** wie in den alten Pi-Docs beschrieben.
- ⚠️ **Bekanntes Problem dadurch:** `.gitignore` schließt `public/images/**/*.jpeg|jpg|png` und `public/music/**/*.mp3` explizit aus ("keep locally, not in git"). Da der VServer nur per `git clone` befüllt wurde, fehlen dort aktuell **alle NPC/Location/SubLocation/Item/Intro/City/Story-Bilder** (185 von 185 referenzierten Pfaden nicht vorhanden, Stand 2026-07-31) — nur die 4 fest eingebundenen Landingpage-Bilder sind da. Musik ist vollständig vorhanden (8/8, da vollständige Ordner separat hochgeladen wurden). Spieler/Companions haben aktuell keine Bilder hinterlegt. Char-Manifest-Fotos sind Base64-inline in der JSON gespeichert, davon nicht betroffen.
  → Fix: fehlende Bilder (Ordner `Aurelius/`, `Nexarion/`, `D-Rektor/` unter `public/images/`) direkt per scp/rsync vom lokalen PC auf den VServer kopieren, nicht über Git. Bei künftigen Deployments diesen Schritt nicht vergessen (Git-Deploy deckt Medien nie ab).
- Backend läuft schlank (Node-Prozess ~120 MB RSS); die vom Hoster gemeldeten "88% RAM" zählen Linux-Puffer/Cache mit, real frei/verfügbar sind ~3.3 GB von 3.8 GB — kein tatsächliches Ressourcenproblem.
- Alte Doku (jetzt teilweise veraltet, Pi-spezifisch): [QUICK_REFERENCE.md](QUICK_REFERENCE.md), [CLOUDFLARE_TUNNEL_SETUP.md](CLOUDFLARE_TUNNEL_SETUP.md), [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md), [LANDING_PAGE_GUIDE.md](LANDING_PAGE_GUIDE.md), [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md), `pi-setup.sh`.
- Windows lokal (Entwicklung): `npm start` (concurrently server+vite), `launch.ps1`/`start.ps1`, `Start DnD Session.bat` → `session_manager_gui.py` (CustomTkinter-Control-Center, startet Backend/Vite/ngrok).
- Login-Daten stehen im Klartext in README/QUICK_REFERENCE (`MasterCookie` / `020266140297`).
- Projektdaten existieren redundant an 3 Orten: lokaler PC, Raspberry Pi (unverändert, nichts gelöscht), VServer (produktiv) — kein akutes Verlustrisiko, aber Git-Repo ist NICHT die vollständige Quelle (Medien fehlen dort by design).

## Assets

`public/images/` (Banner, Panorama, Icon, Hintergrund – Kopien in `homepage_bilder/`), `public/music/{ambient,combat,market,tavern}/*.mp3`, `public/Tooltips/*.txt`, `public/CardCreator/PlayerCards.html` (eigenständiger Kartengenerator). Große Medien sind per `.gitignore` ausgeschlossen.

## Altlasten / nicht anfassen ohne Grund

`PlayerView_original.jsx`, `src/components/PlayerView.jsx.backup`, `player_original.html`, `struktur.txt` (alter Verzeichnis-Dump mit veraltetem Pfad), `char_manifest/`, Python-PDF-Skripte (`pdf_reader.py`, `split_pdf_by_category.py`, `translate_all_categories.py`, `translation_status.py` – Übersetzung eines 18+-Quellenbands, Ordner `Info_DnD_18+/` ist gitignored), `generate-hash.js`, `start-all.js`.

## Bekannte Schwachstellen (bewusst, nicht ungefragt fixen)

- Kein File-Locking → paralleles Schreiben kann `session-data.json` beschädigen.
- Kein Session-Ablauf/Cleanup in `active-sessions.json`; ETag ist `Date.now()` (nutzlos für Caching).
- `POST /api/data` und `/api/landing-data` sind **ungeschützt** (keine Rollenprüfung).
- Hexagon-Modus verliert alle Daten beim Reload.
- Socket.IO CORS `origin: "*"`.

## Zuletzt gearbeitet (Git-Historie, neueste zuerst)

1. Char Manifest im Site-Theme neu designt, neues Panorama-Banner
2. Save-Button, localStorage-Cache, Bildkompression, HTTP-Caching, Session-Links
3. GM-Admin-Ansicht: alle User-Chars sehen & editieren
4. Rechtsseiten (Impressum/Datenschutz/AGB) + Footer/Login-Links
5. Responsive-Arbeit (Banner, Tabs, Userbar, Spacing)

Aktuell uncommitted: `.env.example`, Cloudflare-Tunnel-Setup, Deployment-/Landing-Docs, `char_manifest/`, `homepage_bilder/`, Änderungen an `.gitignore`/`README.md`/`pi-setup.sh`.
