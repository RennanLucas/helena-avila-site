import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract parts
head_pattern = re.compile(r'(<!DOCTYPE html>.*?<body>)', re.DOTALL)
head = head_pattern.search(content).group(1)

header_pattern = re.compile(r'(<!-- Background Decorative Blobs -->.*?</header>)', re.DOTALL)
header = header_pattern.search(content).group(1)

footer_pattern = re.compile(r'(<!-- 7\. RODAPÉ \(FOOTER\) -->.*?</html>)', re.DOTALL)
footer = footer_pattern.search(content).group(1)

# Fix navigation links in header and footer
def update_nav(html):
    html = html.replace('href="#inicio"', 'href="index.html#inicio"')
    html = html.replace('href="#sobre"', 'href="sobre.html#sobre"')
    html = html.replace('href="#especialidades"', 'href="sobre.html#especialidades"')
    html = html.replace('href="#metodologia"', 'href="index.html#metodologia"')
    html = html.replace('href="#videos"', 'href="avaliacoes.html#videos"')
    html = html.replace('href="#jornada"', 'href="index.html#jornada"')
    html = html.replace('href="#depoimentos"', 'href="avaliacoes.html#depoimentos"')
    html = html.replace('href="#faq"', 'href="index.html#faq"')
    html = html.replace('href="#contato"', 'href="index.html#contato"')
    return html

header = update_nav(header)
footer = update_nav(footer)

# Extract sections
hero = re.search(r'(<!-- 2\. SEÇÃO HERO.*?)</section>', content, re.DOTALL).group(1) + '</section>'
sobre = re.search(r'(<!-- 3\. SEÇÃO "SOBRE MIM".*?)</section>', content, re.DOTALL).group(1) + '</section>'
especialidades = re.search(r'(<!-- 4\. SEÇÃO "ÁREAS DE ATUAÇÃO / ESPECIALIDADES".*?)</section>', content, re.DOTALL).group(1) + '</section>'
metodologia = re.search(r'(<!-- 5\. SEÇÃO "METODOLOGIA: POR QUE É DIFERENTE\?".*?)</section>', content, re.DOTALL).group(1) + '</section>'
videos = re.search(r'(<!-- SEÇÃO VÍDEOS & CONTEÚDOS DO YOUTUBE -->.*?)</section>', content, re.DOTALL).group(1) + '</section>'
jornada = re.search(r'(<!-- NEW SECTION 1: JORNADA DO PACIENTE -->.*?)</section>', content, re.DOTALL).group(1) + '</section>'
depoimentos = re.search(r'(<!-- SEÇÃO DEPOIMENTOS / AVALIAÇÕES DO GOOGLE -->.*?<div class="carousel-action text-center mt-lg fade-in-up">.*?</div>.*?</div>.*?)</section>', content, re.DOTALL).group(1) + '</section>'
faq = re.search(r'(<!-- NEW SECTION 3: FAQ / PERGUNTAS FREQUENTES -->.*?)</section>', content, re.DOTALL).group(1) + '</section>'
location = re.search(r'(<!-- NEW SECTION 4: LOCALIZAÇÃO & MODALIDADES DE ATENDIMENTO -->.*?)</section>', content, re.DOTALL).group(1) + '</section>'
contact = re.search(r'(<!-- 6\. SEÇÃO DE AGENDAMENTO E CONTATO -->.*?)</section>', content, re.DOTALL).group(1) + '</section>'

# Create new index.html
new_index = f"{head}\n{header}\n{hero}\n{metodologia}\n{jornada}\n{faq}\n{location}\n{contact}\n{footer}"

# Create sobre.html
new_sobre = f"{head}\n{header}\n{sobre}\n{especialidades}\n{footer}"
new_sobre = new_sobre.replace('<title>Helena Ávila | Psicoterapeuta e Psicanalista</title>', '<title>Sobre | Helena Ávila</title>')

# Create avaliacoes.html
# Need the review modal for avaliacoes.html
modal = re.search(r'(<!-- Review Modal Overlay -->.*?</div>\s*</div>)', content, re.DOTALL).group(1)
new_avaliacoes = f"{head}\n{header}\n{videos}\n{depoimentos}\n{footer}"
new_avaliacoes = new_avaliacoes.replace('<!-- Review Modal Overlay -->', modal + '\n\n    <!-- Review Modal Overlay -->') # Ensure modal is there
# Wait, footer already includes the modal and floating whatsapp because it matches from footer to </html>
# Ah! Let's check where the modal is. It's inside the footer match if it goes to </html>.
# Let's clean up the modal logic.
footer_clean = re.search(r'(<!-- 7\. RODAPÉ \(FOOTER\) -->.*?</footer>)', content, re.DOTALL).group(1)
whatsapp = re.search(r'(<!-- Floating WhatsApp Widget -->.*?</a>)', content, re.DOTALL).group(1)
scripts = '\n    <script src="script.js"></script>\n</body>\n</html>'

new_index = f"{head}\n{header}\n{hero}\n{metodologia}\n{jornada}\n{faq}\n{location}\n{contact}\n{footer_clean}\n{whatsapp}\n{scripts}"

new_sobre = f"{head}\n{header}\n{sobre}\n{especialidades}\n{footer_clean}\n{whatsapp}\n{scripts}"
new_sobre = new_sobre.replace('<title>Helena Ávila | Psicoterapeuta e Psicanalista</title>', '<title>Sobre | Helena Ávila</title>')

new_avaliacoes = f"{head}\n{header}\n{videos}\n{depoimentos}\n{footer_clean}\n{whatsapp}\n{modal}\n{scripts}"
new_avaliacoes = new_avaliacoes.replace('<title>Helena Ávila | Psicoterapeuta e Psicanalista</title>', '<title>Avaliações | Helena Ávila</title>')

new_index = update_nav(new_index)
new_sobre = update_nav(new_sobre)
new_avaliacoes = update_nav(new_avaliacoes)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index)

with open('sobre.html', 'w', encoding='utf-8') as f:
    f.write(new_sobre)

with open('avaliacoes.html', 'w', encoding='utf-8') as f:
    f.write(new_avaliacoes)

print("Split completed successfully!")
