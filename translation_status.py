"""
Status-Tracker für die Übersetzung aller Kategorien
"""
import os
from pathlib import Path

INPUT_DIR = "Info_DnD_18+"
OUTPUT_DIR = os.path.join(INPUT_DIR, "DE")

CATEGORIES = [
    ("01_Einleitung_und_Weltgeschichte.txt", 197.5, "Einleitung, Geschichte & Kosmologie"),
    ("02_Pantheon.txt", 51.1, "Pantheon - Götter & Göttinnen"),  
    ("03_Fraktionen.txt", 66.3, "Fraktionen und Gesellschaften"),
    ("04_Orte_und_Staedte.txt", 220.4, "Gazetteer - Orte & Städte"),
    ("05_Kinks_Spielmechaniken.txt", 0, "Kinks & Spielmechaniken ✓ FERTIG"),
    ("06_Rassen_und_Spezies.txt", 71.9, "Rassen & Spezies"),
    ("07_Backgrounds.txt", 35.6, "Backgrounds - Hintergründe"),
    ("08_Klassen_und_Subklassen.txt", 233.8, "Klassen & Subklassen"),
    ("09_Feats.txt", 16.5, "Feats - Talente"),
    ("10_Zauber.txt", 115.1, "Zauber (Spells)"),
    ("11_Items_und_Magische_Items.txt", 68.9, "Items & Magische Items"),
    ("12_Bestiary.txt", 155.0, "Bestiary - Monster & Kreaturen"),
]

print("=" * 80)
print("ÜBERSETZUNGSSTATUS - Kinks & Cantrips Deutsche Version")
print("=" * 80)
print()

total_kb = sum(kb for _, kb, _ in CATEGORIES)
completed = 0
pending = 0

for filename, kb, description in CATEGORIES:
    output_file = os.path.join(OUTPUT_DIR, filename)
    
    if kb == 0 or os.path.exists(output_file):
        status = "✅ FERTIG"
        completed += 1
    else:
        status = "⏳ AUSSTEHEND"
        pending += 1
    
    kb_display = f"({kb:6.1f} KB)" if kb > 0 else "(  DONE  )"
    print(f"{status}  {filename:45s} {kb_display} - {description}")

print()
print("=" * 80)
print(f"Fortschritt: {completed}/{len(CATEGORIES)} Kategorien übersetzt")
print(f"Verbleibend: {pending} Kategorien ({total_kb:.1f} KB)")
print("=" * 80)
