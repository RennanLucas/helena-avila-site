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

// Validação simples e determinística: sem regex que reescreve o JavaScript.
const requiredAssets = [
  'assets/videos/helena-video-01.mp4',
  'assets/videos/helena-video-02.mp4',
  'assets/videos/helena-video-01-cover.jpg',
  'assets/helena-portrait.jpg'
];

for (const rel of requiredAssets) {
  const full = path.join(out, rel);
  if (!fs.existsSync(full) || fs.statSync(full).size < 1024) {
    throw new Error(`Asset ausente ou inválido: ${rel}`);
  }
}

const scriptPath = path.join(out, 'script.js');
if (!fs.existsSync(scriptPath)) throw new Error('script.js não encontrado');
const js = fs.readFileSync(scriptPath, 'utf8');

const checks = [
  ["src: 'assets/videos/helena-video-01.mp4'", 'fonte nativa do vídeo 1'],
  ["src: 'assets/videos/helena-video-02.mp4'", 'fonte nativa do vídeo 2'],
  ["poster: 'assets/helena-portrait.jpg'", 'capa visível do vídeo 2'],
  ['function createModal()', 'player modal'],
  ['function createAboutVideo(modal)', 'bloco responsivo do segundo vídeo'],
  ['hv-watermark-mask', 'máscara visual que elimina a marca do editor'],
  ['@media(max-width:600px)', 'layout mobile dedicado']
];

for (const [needle, label] of checks) {
  if (!js.includes(needle)) throw new Error(`Validação falhou: ${label}`);
}

const indexPath = path.join(out, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('index.html não encontrado');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=31"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

// Chunks base64 legados não entram no bundle final; os MP4 nativos são servidos diretamente.
fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

console.log('Build v31 validado: vídeos nativos, poster visível, mobile premium e máscara sem Descript.');
