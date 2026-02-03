try:
    import PyPDF2
    print("PyPDF2 found, attempting extraction...")
    
    with open("20-QUESTION QUESTIONNAIRE.pdf", "rb") as file:
        reader = PyPDF2.PdfReader(file)
        print(f"\nTotal pages: {len(reader.pages)}\n")
        
        full_text = ""
        for i, page in enumerate(reader.pages):
            print(f"{'='*80}")
            print(f"PAGE {i+1}")
            print(f"{'='*80}")
            text = page.extract_text()
            print(text)
            full_text += f"\n\n{'='*80}\nPAGE {i+1}\n{'='*80}\n\n{text}"
        
        with open("questionnaire_extracted.txt", "w", encoding="utf-8") as f:
            f.write(full_text)
        
        print("\n\n✅ SUCCESS! Saved to questionnaire_extracted.txt")
        
except ImportError:
    print("PyPDF2 not installed. Installing now...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    print("Please run this script again.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
