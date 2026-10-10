const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, 'public');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const excluded = new Set(['.git', '.github', 'public', 'node_modules']);
for (const name of fs.readdirSync(root)) {
  if (excluded.has(name)) continue;
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}

// Produção: usa o player hospedado do Descript. O navegador não reconstrói MP4 em base64.
const scriptPath = path.join(out, 'script.js');
let js = fs.readFileSync(scriptPath, 'utf8');

const sourcesPattern = /  const VIDEO_SOURCES = \{[\s\S]*?  const playIcon =/;
if (!sourcesPattern.test(js)) throw new Error('Bloco VIDEO_SOURCES não encontrado');
js = js.replace(sourcesPattern, `  const VIDEO_SOURCES = {\n    one: { embed: 'https://share.descript.com/embed/0j5NN4M3T7D', title: 'Uma conversa com Helena Ávila', duration: '1:35', poster: 'assets/helena-sobre.jpg' },\n    two: { embed: 'https://share.descript.com/embed/kF0vcw6QwKl', title: 'Uma reflexão com Helena', duration: '2:45', poster: 'assets/helena-portrait.jpg' }\n  };\n\n  const playIcon =`);

const modalPattern = /  function createModal\(\) \{[\s\S]*?\n  \}\n\n  function createMainSection/;
if (!modalPattern.test(js)) throw new Error('Função createModal não encontrada');
const modalReplacement = `  function createModal() {\n    const modal = document.createElement('div');\n    modal.className = 'hv-modal';\n    modal.innerHTML = \`<div class=\"hv-modal-shell\"><button class=\"hv-close\" type=\"button\" aria-label=\"Fechar vídeo\">\${closeIcon}</button><div class=\"hv-modal-frame\"><iframe title=\"Vídeo de Helena Ávila\" src=\"about:blank\" loading=\"eager\" allow=\"autoplay; fullscreen; encrypted-media; picture-in-picture\" allowfullscreen scrolling=\"no\"></iframe></div><div class=\"hv-modal-caption\"><strong></strong></div></div>\`;\n    document.body.appendChild(modal);\n    const frame = modal.querySelector('iframe');\n    const title = modal.querySelector('strong');\n    const close = () => {\n      frame.src = 'about:blank';\n      modal.classList.remove('is-open');\n      document.body.classList.remove('hv-lock');\n    };\n    modal.querySelector('.hv-close').addEventListener('click', close);\n    modal.addEventListener('click', e => { if (e.target === modal) close(); });\n    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });\n    return {\n      open(key) {\n        const source = VIDEO_SOURCES[key];\n        title.textContent = source.title;\n        frame.src = source.embed;\n        modal.classList.add('is-open');\n        document.body.classList.add('hv-lock');\n      }\n    };\n  }\n\n  function createMainSection`;
js = js.replace(modalPattern, modalReplacement);
js = js.replace('.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000}', '.hv-modal video,.hv-modal iframe{width:100%;height:100%;object-fit:contain;background:#000;border:0;display:block}');
fs.writeFileSync(scriptPath, js, 'utf8');

// Os chunks antigos estavam corrompidos e não são mais enviados ao navegador.
fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=25"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Build v25: player Descript estável + chunks inválidos removidos.');