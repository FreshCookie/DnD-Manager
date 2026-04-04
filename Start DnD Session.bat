@echo off
chcp 65001 >nul
title DnD Session Manager - Python GUI

:: Pfad zum Projekt
cd /d "%~dp0"

:: Prüfe ob Python installiert ist
python --version >nul 2>&1
if errorlevel 1 (
    echo [FEHLER] Python ist nicht installiert!
    echo Bitte installiere Python von https://www.python.org/
    pause
    exit
)

:: Prüfe ob Requirements installiert sind
echo Prüfe Python-Abhängigkeiten...
pip show customtkinter >nul 2>&1
if errorlevel 1 (
    echo Installiere benötigte Pakete...
    pip install -r requirements-gui.txt
)

:: Starte Python GUI
echo Starte GUI Control Center...
python session_manager_gui.py

exit