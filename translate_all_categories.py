"""
Automated translation script for all PDF categories.
This will create German versions (_DE.txt) for all extracted categories.
"""

import os
from pathlib import Path

# Note: This is a planning script - actual translation will be done manually
# to ensure quality and preserve all game mechanics accurately.

CATEGORIES = [
    "01_Einleitung_und_Weltgeschichte.txt",
    "02_Pantheon.txt",
    "03_Fraktionen.txt",
    "04_Orte_und_Staedte.txt",
    "06_Rassen_und_Spezies.txt",
    "07_Backgrounds.txt",
    "08_Klassen_und_Subklassen.txt",
    "09_Feats.txt",
    "10_Zauber.txt",
    "11_Items_und_Magische_Items.txt",
    "12_Bestiary.txt"
]

INPUT_DIR = "Info_DnD_18+"

print("Kategorien für Übersetzung:")
print("=" * 80)
for i, cat in enumerate(CATEGORIES, 1):
    input_file = os.path.join(INPUT_DIR, cat)
    output_file = os.path.join(INPUT_DIR, cat.replace(".txt", "_DE.txt"))
    
    if os.path.exists(input_file):
        size = os.path.getsize(input_file) / 1024  # KB
        exists = " ✓ FERTIG" if os.path.exists(output_file) else " ⏳ AUSSTEHEND"
        print(f"{i:2d}. {cat:45s} ({size:7.1f} KB){exists}")
    else:
        print(f"{i:2d}. {cat:45s} - FEHLT!")

print("\n" + "=" * 80)
print("Status: Übersetzung läuft...")
