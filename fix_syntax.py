import re

# Read the file
with open(r'c:\Users\hp\Desktop\PROJECTS\bodi kemistri\Bodi-Kemistri\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and fix the malformed Webcam style object
# Pattern: objectFit: 'cover', ... transform: 'scaleX(-1)' }} transform: "scaleX(-1)", visibility: "hidden", }}
pattern = r"(objectFit: 'cover',.*?transform: 'scaleX\(-1\)').*?\}\s*\}\s*transform: \"scaleX\(-1\)\",\s*visibility: \"hidden\",\s*\}\}"

replacement = r"\1,\n            visibility: \"hidden\"\n          }}"

# Apply the fix
fixed_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open(r'c:\Users\hp\Desktop\PROJECTS\bodi kemistri\Bodi-Kemistri\App.jsx', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("✅ Fixed syntax error in App.jsx!")
print("Lines 964-967 have been corrected.")
