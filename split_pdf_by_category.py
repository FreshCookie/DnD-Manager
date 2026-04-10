import PyPDF2
import os

def extract_pages_to_file(pdf_reader, start_page, end_page, output_file, category_name):
    """Extract specific pages and save to a text file."""
    content = f"# {category_name}\n"
    content += f"Seiten {start_page + 1} - {end_page}\n"
    content += "=" * 80 + "\n\n"
    
    for page_num in range(start_page, end_page):
        if page_num >= len(pdf_reader.pages):
            break
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        content += f"\n--- SEITE {page_num + 1} ---\n\n"
        content += text
        content += "\n\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ {category_name} gespeichert: {output_file}")

def split_pdf_by_categories():
    """Split the PDF into categorized text files."""
    pdf_path = r"Info_DnD_18+\Kinks_And_Cantrips_Revised.pdf"
    output_dir = r"Info_DnD_18+"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("Öffne PDF...")
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        total_pages = len(pdf_reader.pages)
        print(f"Gesamtseitenzahl: {total_pages}\n")
        
        # Kategorien basierend auf dem Inhaltsverzeichnis (Seitenzahlen sind 0-basiert)
        # Die Seitenzahlen im PDF-Dokument stimmen nicht mit PDF-Seitennummer überein
        # Wir müssen die tatsächlichen Seiten anpassen
        
        categories = [
            # (Start, Ende, Dateiname, Kategoriename)
            (3, 38, "01_Einleitung_und_Weltgeschichte.txt", "Einleitung, Geschichte & Kosmologie"),
            (9, 18, "02_Pantheon.txt", "Pantheon - Götter & Göttinnen"),
            (25, 38, "03_Fraktionen.txt", "Fraktionen und Gesellschaften"),
            (38, 81, "04_Orte_und_Staedte.txt", "Gazetteer - Orte & Städte"),
            (81, 88, "05_Kinks_Spielmechaniken.txt", "Kinks & Spielmechaniken (Pleasure & Pain)"),
            (88, 105, "06_Rassen_und_Spezies.txt", "Rassen & Spezies"),
            (96, 105, "07_Backgrounds.txt", "Backgrounds - Hintergründe"),
            (105, 163, "08_Klassen_und_Subklassen.txt", "Klassen & Subklassen"),
            (163, 166, "09_Feats.txt", "Feats - Talente"),
            (166, 191, "10_Zauber.txt", "Zauber (Spells)"),
            (191, 206, "11_Items_und_Magische_Items.txt", "Items & Magische Items"),
            (206, 248, "12_Bestiary.txt", "Bestiary - Monster & Kreaturen"),
        ]
        
        print("Beginne Extraktion nach Kategorien...\n")
        
        for start, end, filename, category in categories:
            output_path = os.path.join(output_dir, filename)
            extract_pages_to_file(pdf_reader, start, end, output_path, category)
        
        print(f"\n{'='*80}")
        print(f"Fertig! {len(categories)} Kategorien wurden erstellt.")
        print(f"{'='*80}")

if __name__ == "__main__":
    split_pdf_by_categories()
