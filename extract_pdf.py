import pdfplumber

pdf_path = "20-QUESTION QUESTIONNAIRE.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for i, page in enumerate(pdf.pages):
            print(f"\n{'='*80}")
            print(f"PAGE {i+1}")
            print(f"{'='*80}\n")
            text = page.extract_text()
            print(text)
            full_text += text + "\n\n"
        
        # Save to text file
        with open("questionnaire_extracted.txt", "w", encoding="utf-8") as f:
            f.write(full_text)
        
        print("\n\nExtraction complete! Saved to questionnaire_extracted.txt")
        
except Exception as e:
    print(f"Error: {e}")
    print("\nTrying alternative method...")
    
    try:
        import PyPDF2
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ""
            for i, page in enumerate(reader.pages):
                print(f"\n{'='*80}")
                print(f"PAGE {i+1}")
                print(f"{'='*80}\n")
                text = page.extract_text()
                print(text)
                full_text += text + "\n\n"
            
            with open("questionnaire_extracted.txt", "w", encoding="utf-8") as f:
                f.write(full_text)
            
            print("\n\nExtraction complete! Saved to questionnaire_extracted.txt")
    except Exception as e2:
        print(f"Alternative method also failed: {e2}")
