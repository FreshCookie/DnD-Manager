@echo off
chcp 65001 >nul
title DnD Session Manager
color 0A

:: === Zeige cooles Startfenster (PowerShell) ===
::powershell -ExecutionPolicy Bypass -File "%~dp0launch.ps1"

echo ============================================
echo         Starte DnD Session Manager
echo ============================================
echo.


:: Pfad zum Projekt
cd /d "C:\Users\kevin\Desktop\DnD Session Manager\dnd-session-manager"

echo [Backend] wird gestartet...
start /min "Backend"  cmd /k "node server.js"
for /f "tokens=2" %%i in ('tasklist /FI "WINDOWTITLE eq Backend" /FO LIST ^| find "PID:"') do set BACKENDPID=%%i

echo [Ngrok] wird gestartet...
start /min "Ngrok"  cmd /k "npm exec ngrok http 5173"
for /f "tokens=2" %%i in ('tasklist /FI "WINDOWTITLE eq Ngrok" /FO LIST ^| find "PID:"') do set NGROKPID=%%i

echo [Vite] wird gestartet...
start /min "Vite"  cmd /k "npm run dev"
for /f "tokens=2" %%i in ('tasklist /FI "WINDOWTITLE eq Vite" /FO LIST ^| find "PID:"') do set VITEPID=%%i

:: Browser Ã¶ffnen
timeout /t 5 /nobreak >nul
::start "" http://localhost:5173

echo.
echo ============================================
echo Alles laeuft! Schließe dieses Fenster,
echo um die Session zu beenden.
echo ============================================
echo.
pause

echo.
echo Stoppe alle Prozesse...
timeout /t 1 /nobreak >nul
echo Backend wird gestoppt...
timeout /t 1 /nobreak >nul
taskkill /PID %BACKENDPID% /T /F >nul 2>&1
echo
echo Backend gestoppt!
timeout /t 2 /nobreak >nul
echo Ngrok wird gestoppt...
timeout /t 1 /nobreak >nul
taskkill /PID %NGROKPID% /T /F >nul 2>&1
echo Ngrok gestoppt!
timeout /t 2 /nobreak >nul
echo Vite wird gestoppt...
timeout /t 1 /nobreak >nul
taskkill /PID %VITEPID% /T /F >nul 2>&1
echo Vite gestoppt!
timeout /t 2 /nobreak >nul
echo Fertig!
echo Auf Wiedersehen! Bis zur nächsten DnD Session...
timeout /t 5 >nul 2>&1
exit