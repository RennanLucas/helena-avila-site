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

// Fontes diretas e capas reais extraídas dos próprios vídeos.
const sourcesPattern = /  const VIDEO_SOURCES = \{[\s\S]*?  const playIcon =/;
if (!sourcesPattern.test(js)) throw new Error('Bloco VIDEO_SOURCES não encontrado');
js = js.replace(sourcesPattern, `  const VIDEO_SOURCES = {\n    one: { src: 'assets/videos/helena-video-01.mp4', title: 'Uma conversa com Helena Ávila', duration: '1:35', poster: 'assets/videos/helena-video-01-cover.jpg' },\n    two: { src: 'assets/videos/helena-video-02.mp4', title: 'Uma reflexão com Helena', duration: '2:45', poster: 'assets/videos/helena-video-02-cover.jpg' }\n  };\n\n  const playIcon =`);

// Player nativo do site.
const modalPattern = /  function createModal\(\) \{[\s\S]*?\n  \}\n\n  function createMainSection/;
if (!modalPattern.test(js)) throw new Error('Função createModal não encontrada');
const modalReplacement = `  function createModal() {\n    const modal = document.createElement('div');\n    modal.className = 'hv-modal';\n    modal.innerHTML = \`<div class=\"hv-modal-shell\"><button class=\"hv-close\" type=\"button\" aria-label=\"Fechar vídeo\">\${closeIcon}</button><div class=\"hv-modal-frame\"><video controls playsinline preload=\"metadata\"></video></div><div class=\"hv-modal-caption\"><strong></strong></div></div>\`;\n    document.body.appendChild(modal);\n    const video = modal.querySelector('video');\n    const title = modal.querySelector('strong');\n    const close = () => {\n      video.pause();\n      video.currentTime = 0;\n      video.removeAttribute('src');\n      video.load();\n      modal.classList.remove('is-open');\n      document.body.classList.remove('hv-lock');\n    };\n    modal.querySelector('.hv-close').addEventListener('click', close);\n    modal.addEventListener('click', e => { if (e.target === modal) close(); });\n    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });\n    return {\n      open(key) {\n        const source = VIDEO_SOURCES[key];\n        title.textContent = source.title;\n        video.poster = source.poster;\n        video.src = source.src;\n        video.muted = false;\n        video.load();\n        modal.classList.add('is-open');\n        document.body.classList.add('hv-lock');\n        const attempt = video.play();\n        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});\n      }\n    };\n  }\n\n  function createMainSection`;
js = js.replace(modalPattern, modalReplacement);

// Segundo vídeo: capa editorial construída no próprio site sobre o frame real do vídeo.
const aboutPattern = /  function createAboutVideo\(modal\) \{[\s\S]*?\n  \}\n\n  function init/;
if (!aboutPattern.test(js)) throw new Error('Função createAboutVideo não encontrada');
const aboutReplacement = `  function createAboutVideo(modal) {\n    const block = document.createElement('div');\n    block.className = 'hv-about';\n    block.innerHTML = \`\n      <button class=\"hv-about-poster\" type=\"button\" aria-label=\"Assistir vídeo Uma reflexão com Helena\">\n        <img src=\"\${VIDEO_SOURCES.two.poster}\" alt=\"Helena Ávila em Uma reflexão com Helena\" loading=\"lazy\" decoding=\"async\" />\n        <span class=\"hv-cover-shade\"></span>\n        <span class=\"hv-cover-brand\"><strong>Helena Ávila</strong><small>Psicoterapia Integrativa</small></span>\n        <span class=\"hv-cover-title\">Uma reflexão <em>com Helena</em></span>\n        <span class=\"hv-cover-badge\"><span class=\"hv-cover-play\">\${playIcon}</span> Vídeo oficial</span>\n      </button>\n      <div class=\"hv-about-copy\"><small>Vídeo oficial · \${VIDEO_SOURCES.two.duration}</small><h3>Uma reflexão com Helena.</h3><p>Um conteúdo complementar para conhecer mais de perto a forma como Helena fala sobre emoções, vínculos e processo terapêutico.</p></div>\n      <div class=\"hv-about-action\">Assistir vídeo →</div>\`;
    block.querySelector('.hv-about-poster').addEventListener('click', () => modal.open('two'));\n    block.querySelector('.hv-about-action').addEventListener('click', () => modal.open('two'));\n    block.querySelector('.hv-about-action').style.cursor = 'pointer';\n    return block;\n  }\n\n  function init`;
js = js.replace(aboutPattern, aboutReplacement);

// Primeiro card: 9:16 real, sem crop excessivo, com leitura melhor no celular.
js = js.replace(
  '.hv-card{position:relative;width:min(100%,390px);aspect-ratio:9/15.4;',
  '.hv-card{position:relative;width:min(100%,360px);aspect-ratio:9/16;'
);
js = js.replace(
  '.hv-card img,.hv-about-poster img{width:100%;height:100%;object-fit:cover;display:block}',
  '.hv-card img,.hv-about-poster img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}'
);
js = js.replace(
  '.hv-card:after,.hv-about-poster:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.05),rgba(12,10,9,.03) 52%,rgba(12,10,9,.64));pointer-events:none}',
  '.hv-card:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,10,9,.02) 0%,rgba(12,10,9,.03) 48%,rgba(12,10,9,.62) 69%,rgba(12,10,9,.96) 100%);pointer-events:none}.hv-about-poster:after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.20);pointer-events:none}'
);
js = js.replace(
  '.hv-about-poster{position:relative;width:170px;aspect-ratio:9/14;',
  '.hv-about-poster{position:relative;width:190px;aspect-ratio:9/16;'
);
js = js.replace(
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000}',
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000;display:block}'
);
js = js.replace(
  '.hv-modal video,.hv-modal iframe{width:100%;height:100%;object-fit:contain;background:#000;border:0;display:block}',
  '.hv-modal video{width:100%;height:100%;object-fit:contain;background:#000;display:block}'
);

// Refinos visuais do card premium e mobile.
const premiumRules = `
      .hv-cover-shade{position:absolute;z-index:1;inset:0;background:linear-gradient(180deg,rgba(245,236,222,.08) 0%,rgba(23,18,15,.05) 43%,rgba(18,15,13,.78) 70%,rgba(18,15,13,.98) 100%);pointer-events:none}
      .hv-cover-brand{position:absolute;z-index:3;left:14px;right:14px;top:14px;text-align:center;color:#f8efe3;text-shadow:0 2px 18px rgba(0,0,0,.45)}
      .hv-cover-brand strong{display:block;font:500 17px/1.05 var(--font-serif,Georgia,serif);letter-spacing:.01em}
      .hv-cover-brand small{display:block;margin-top:5px;font:800 6px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.19em;text-transform:uppercase}
      .hv-cover-title{position:absolute;z-index:3;left:16px;right:16px;bottom:52px;color:#fff;text-align:center;font:500 21px/.98 var(--font-serif,Georgia,serif);text-shadow:0 2px 20px rgba(0,0,0,.42)}
      .hv-cover-title em{display:block;color:#e3bd7b;font-weight:400}
      .hv-cover-badge{position:absolute;z-index:3;left:50%;bottom:16px;transform:translateX(-50%);display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;background:rgba(197,160,89,.94);color:#fff;white-space:nowrap;font:800 7px/1 var(--font-sans,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase;box-shadow:0 7px 20px rgba(0,0,0,.24)}
      .hv-cover-play{display:grid;place-items:center;width:12px;height:12px}.hv-cover-play svg{width:12px;height:12px}
      @media(max-width:600px){.hv-card{width:min(76vw,300px)!important;border-radius:22px!important}.hv-card-title{font-size:20px!important;line-height:1.04}.hv-card-bottom{left:18px;right:18px;bottom:18px}.hv-card-play{margin-top:11px;font-size:9px}.hv-play{width:38px;height:38px}.hv-card-top{top:14px;left:14px;right:14px}.hv-pill{font-size:8px;padding:6px 8px}.hv-about{grid-template-columns:118px 1fr!important;gap:16px!important}.hv-about-poster{width:118px!important;aspect-ratio:9/16!important}.hv-cover-brand{top:10px;left:8px;right:8px}.hv-cover-brand strong{font-size:12px}.hv-cover-brand small{font-size:4.8px}.hv-cover-title{left:8px;right:8px;bottom:38px;font-size:14px}.hv-cover-badge{bottom:10px;padding:5px 7px;font-size:5.5px;gap:4px}.hv-cover-play,.hv-cover-play svg{width:9px;height:9px}}
`;
js = js.replace('      body.hv-lock{overflow:hidden}', premiumRules + '      body.hv-lock{overflow:hidden}');

fs.writeFileSync(scriptPath, js, 'utf8');

// Chunks antigos não fazem parte do bundle final.
fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=29"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Build v29: capa válida + editorial premium + mobile final sem sobrescrita.');
