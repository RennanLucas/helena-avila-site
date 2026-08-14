const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Extract parts
const headPattern = /(<!DOCTYPE html>[\s\S]*?<body>)/;
const head = content.match(headPattern)[1];

const headerPattern = /(<!-- Background Decorative Blobs -->[\s\S]*?<\/header>)/;
const header = content.match(headerPattern)[1];

const footerPattern = /(<!-- 7\. RODAPÉ \(FOOTER\) -->[\s\S]*?<\/html>)/;
const footer = content.match(footerPattern)[1];

function updateNav(html) {
    let result = html;
    result = result.replace(/href="#inicio"/g, 'href="index.html#inicio"');
    result = result.replace(/href="#sobre"/g, 'href="sobre.html#sobre"');
    result = result.replace(/href="#especialidades"/g, 'href="sobre.html#especialidades"');
    result = result.replace(/href="#metodologia"/g, 'href="index.html#metodologia"');
    result = result.replace(/href="#videos"/g, 'href="avaliacoes.html#videos"');
    result = result.replace(/href="#jornada"/g, 'href="index.html#jornada"');
    result = result.replace(/href="#depoimentos"/g, 'href="avaliacoes.html#depoimentos"');
    result = result.replace(/href="#faq"/g, 'href="index.html#faq"');
    result = result.replace(/href="#contato"/g, 'href="index.html#contato"');
    return result;
}

const updatedHeader = updateNav(header);

const heroMatch = content.match(/(<!-- 2\. SEÇÃO HERO[\s\S]*?)<\/section>/);
const hero = heroMatch[1] + '</section>';

const sobreMatch = content.match(/(<!-- 3\. SEÇÃO "SOBRE MIM"[\s\S]*?)<\/section>/);
const sobre = sobreMatch[1] + '</section>';

const especialidadesMatch = content.match(/(<!-- 4\. SEÇÃO "ÁREAS DE ATUAÇÃO \/ ESPECIALIDADES"[\s\S]*?)<\/section>/);
const especialidades = especialidadesMatch[1] + '</section>';

const metodologiaMatch = content.match(/(<!-- 5\. SEÇÃO "METODOLOGIA: POR QUE É DIFERENTE\?"[\s\S]*?)<\/section>/);
const metodologia = metodologiaMatch[1] + '</section>';

const videosMatch = content.match(/(<!-- SEÇÃO VÍDEOS & CONTEÚDOS DO YOUTUBE -->[\s\S]*?)<\/section>/);
const videos = videosMatch[1] + '</section>';

const jornadaMatch = content.match(/(<!-- NEW SECTION 1: JORNADA DO PACIENTE -->[\s\S]*?)<\/section>/);
const jornada = jornadaMatch[1] + '</section>';

const depoimentosMatch = content.match(/(<!-- SEÇÃO DEPOIMENTOS \/ AVALIAÇÕES DO GOOGLE -->[\s\S]*?<div class="carousel-action text-center mt-lg fade-in-up">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?)<\/section>/);
const depoimentos = depoimentosMatch[1] + '</section>';

const faqMatch = content.match(/(<!-- NEW SECTION 3: FAQ \/ PERGUNTAS FREQUENTES -->[\s\S]*?)<\/section>/);
const faq = faqMatch[1] + '</section>';

const locationMatch = content.match(/(<!-- NEW SECTION 4: LOCALIZAÇÃO & MODALIDADES DE ATENDIMENTO -->[\s\S]*?)<\/section>/);
const location = locationMatch[1] + '</section>';

const contactMatch = content.match(/(<!-- 6\. SEÇÃO DE AGENDAMENTO E CONTATO -->[\s\S]*?)<\/section>/);
const contact = contactMatch[1] + '</section>';

const footerCleanMatch = content.match(/(<!-- 7\. RODAPÉ \(FOOTER\) -->[\s\S]*?<\/footer>)/);
const footerClean = updateNav(footerCleanMatch[1]);

const whatsappMatch = content.match(/(<!-- Floating WhatsApp Widget -->[\s\S]*?<\/a>)/);
const whatsapp = whatsappMatch[1];

const modalMatch = content.match(/(<!-- Review Modal Overlay -->[\s\S]*?<\/div>\s*<\/div>)/);
const modal = modalMatch[1];

const scripts = '\n    <script src="script.js"></script>\n</body>\n</html>';

let newIndex = `${head}\n${updatedHeader}\n${hero}\n${metodologia}\n${jornada}\n${faq}\n${location}\n${contact}\n${footerClean}\n${whatsapp}\n${scripts}`;

let newSobre = `${head}\n${updatedHeader}\n${sobre}\n${especialidades}\n${footerClean}\n${whatsapp}\n${scripts}`;
newSobre = newSobre.replace('<title>Helena Ávila | Psicoterapeuta e Psicanalista</title>', '<title>Sobre | Helena Ávila</title>');

let newAvaliacoes = `${head}\n${updatedHeader}\n${videos}\n${depoimentos}\n${footerClean}\n${whatsapp}\n${modal}\n${scripts}`;
newAvaliacoes = newAvaliacoes.replace('<title>Helena Ávila | Psicoterapeuta e Psicanalista</title>', '<title>Avaliações | Helena Ávila</title>');

fs.writeFileSync('index.html', newIndex, 'utf8');
fs.writeFileSync('sobre.html', newSobre, 'utf8');
fs.writeFileSync('avaliacoes.html', newAvaliacoes, 'utf8');

console.log("Split completed successfully!");
