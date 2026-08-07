import os
import glob

ga_snippet = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VX80WKG1WG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VX80WKG1WG');
</script>"""

html_files = [f for f in glob.glob('**/*.html', recursive=True) if 'node_modules' not in f and 'backend' not in f]

injected = 0
already_present = 0

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    if 'G-VX80WKG1WG' in code:
        already_present += 1
        continue
    
    if '<head>' in code:
        code = code.replace('<head>', '<head>\n' + ga_snippet, 1)
    elif '</head>' in code:
        code = code.replace('</head>', ga_snippet + '\n</head>', 1)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    injected += 1

print(f"Injected Google Analytics into {injected} HTML files ({already_present} already had it). Total checked: {len(html_files)}")
