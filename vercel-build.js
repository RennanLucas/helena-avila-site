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

// Validação dos arquivos nativos antes de publicar.
const nativeAssets = [
  'assets/videos/helena-video-01.mp4',
  'assets/videos/helena-video-02.mp4',
  'assets/videos/helena-video-01-cover.jpg',
  'assets/videos/helena-video-02-cover.jpg'
];
for (const rel of nativeAssets) {
  const full = path.join(out, rel);
  if (!fs.existsSync(full) || fs.statSync(full).size < 1024) {
    throw new Error(`Asset de vídeo ausente ou inválido: ${rel}`);
  }
}

const scriptPath = path.join(out, 'script.js');
let js = fs.readFileSync(scriptPath, 'utf8');

// Fontes diretas: sem Descript, sem autor/data de terceiros, sem base64 no navegador.
const sourcesPattern = /  const VIDEO_SOURCES = \{[\s\S]*?  const playIcon =/;
if (!sourcesPattern.test(js)) throw new Error('Bloco VIDEO_SOURCES não encontrado');
js = js.replace(sourcesPattern, `  const VIDEO_SOURCES = {\n    one: { src: 'assets/videos/helena-video-01.mp4', title: 'Uma conversa com Helena Ávila', duration: '1:35', poster: 'assets/videos/helena-video-01-cover.jpg' },\n    two: { src: 'assets/videos/helena-video-02.mp4', title: 'Uma reflexão com Helena', duration: '2:45', poster: 'assets/videos/helena-video-02-cover.jpg' }\n  };\n\n  const playIcon =`);

// Player nativo do site.
const modalPattern = /  function createModal\(\) \{[\s\S]*?\n  \}\n\n  function createMainSection/;
if (!modalPattern.test(js)) throw new Error('Função createModal não encontrada');
const modalReplacement = `  function createModal() {\n    const modal = document.createElement('div');\n    modal.className = 'hv-modal';\n    modal.innerHTML = \`<div class=\"hv-modal-shell\"><button class=\"hv-close\" type=\"button\" aria-label=\"Fechar vídeo\">\${closeIcon}</button><div class=\"hv-modal-frame\"><video controls playsinline preload=\"metadata\"></video></div><div class=\"hv-modal-caption\"><strong></strong></div></div>\`;\n    document.body.appendChild(modal);\n    const video = modal.querySelector('video');\n    const title = modal.querySelector('strong');\n    const close = () => {\n      video.pause();\n      video.currentTime = 0;\n      video.removeAttribute('src');\n      video.load();\n      modal.classList.remove('is-open');\n      document.body.classList.remove('hv-lock');\n    };\n    modal.querySelector('.hv-close').addEventListener('click', close);\n    modal.addEventListener('click', e => { if (e.target === modal) close(); });\n    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });\n    return {\n      open(key) {\n        const source = VIDEO_SOURCES[key];\n        title.textContent = source.title;\n        video.poster = source.poster;\n        video.src = source.src;\n        video.muted = false;\n        video.load();\n        modal.classList.add('is-open');\n        document.body.classList.add('hv-lock');\n        const attempt = video.play();\n        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});\n      }\n    };\n  }\n\n  function createMainSection`;
js = js.replace(modalPattern, modalReplacement);

// Capa editorial: frame oficial do próprio vídeo + painel inferior limpo.
js = js.replace(
  '.hv-card img,.hv-about-poster img{width:100%;height:100%;object-fit:cover;display:block}',
  '.hv-card img{width:100%;height:72%;object-fit:cover;object-position:center 18%;display:block}.hv-about-poster img{width:100%;height:100%;object-fit:cover;object-position:center 18%;display:block}'
);
js = js.replace(
  '.hv-card:after,.hv-about-poster:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.05),rgba(12,10,9,.03) 52%,rgba(12,10,9,.64));pointer-events:none}',
  '.hv-card:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.03) 0%,rgba(12,10,9,.02) 48%,rgba(12,10,9,.22) 58%,rgba(12,10,9,.96) 72%,#171719 100%);pointer-events:none}.hv-about-poster:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.02) 45%,rgba(12,10,9,.38) 62%,rgba(12,10,9,.94) 82%,#171719 100%);pointer-events:none}'
);
js = js.replace(
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000}',
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000;display:block}'
);
js = js.replace(
  '.hv-modal video,.hv-modal iframe{width:100%;height:100%;object-fit:contain;background:#000;border:0;display:block}',
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000;display:block}'
);
fs.writeFileSync(scriptPath, js, 'utf8');

// Chunks antigos não fazem parte do bundle final.
fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=26"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Build v26: MP4 nativo + capas oficiais + player sem metadados externos.');