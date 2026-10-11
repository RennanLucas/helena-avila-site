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

const requiredAssets = [
  'assets/videos/helena-video-01.mp4',
  'assets/videos/helena-video-02.mp4',
  'assets/videos/helena-video-01-cover.jpg',
  'assets/videos/helena-video-02-cover-premium.jpg'
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
  ["poster: 'assets/videos/helena-video-02-cover-premium.jpg'", 'capa premium do vídeo 2'],
  ['function createModal()', 'player modal'],
  ['function createAboutVideo(modal)', 'bloco do segundo vídeo'],
  ['object-fit:cover;object-position:center 54%', 'recorte que remove a faixa superior do editor']
];

for (const [needle, label] of checks) {
  if (!js.includes(needle)) throw new Error(`Validação falhou: ${label}`);
}

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=30"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

// Os chunks base64 antigos não são necessários no bundle publicado.
fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

console.log('Build v30 validado: MP4 nativo + capa premium + recorte sem Descript.');
