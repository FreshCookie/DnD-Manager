import PyPDF2
import sys

def read_pdf_pages(pdf_path, start_page=0, end_page=10):
    """Read and extract text from specific pages of a PDF."""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            total_pages = len(pdf_reader.pages)
            
            print(f"PDF: {pdf_path}")
            print(f"Gesamtseitenzahl: {total_pages}")
            print(f"\n{'='*80}\n")
            
            # Adjust end_page if it exceeds total pages
            end_page = min(end_page, total_pages)
            
            for page_num in range(start_page, end_page):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                
                print(f"--- SEITE {page_num + 1} ---")
                print(text)
                print(f"\n{'='*80}\n")
                
    except Exception as e:
        print(f"Fehler beim Lesen der PDF: {e}")
        sys.exit(1)

if __name__ == "__main__":
    pdf_path = r"Info_DnD_18+\Kinks_And_Cantrips_Revised.pdf"
    
    # Read first 10 pages
    read_pdf_pages(pdf_path, 0, 10)
