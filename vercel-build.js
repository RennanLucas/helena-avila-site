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
  'assets/helena-sobre.jpg',
  'assets/helena-portrait.jpg',
  'video-fix.js'
];

for (const rel of requiredAssets) {
  const full = path.join(out, rel);
  if (!fs.existsSync(full) || fs.statSync(full).size < 256) {
    throw new Error(`Asset ausente ou inválido: ${rel}`);
  }
}

const scriptPath = path.join(out, 'script.js');
if (!fs.existsSync(scriptPath)) throw new Error('script.js não encontrado');
const js = fs.readFileSync(scriptPath, 'utf8');

const checks = [
  ['premium editorial video experience v36', 'versão v36 do player'],
  ["src: 'assets/videos/helena-video-01.mp4'", 'fonte nativa do vídeo principal'],
  ['hv-mobile-open', 'botão mobile dedicado'],
  ['bindMobileSafeOpen', 'tratamento de toque mobile'],
  ['content-visibility:visible!important', 'hit testing mobile sem content-visibility'],
  ['webkit-playsinline', 'compatibilidade iPhone'],
  ['hv-poster-layer', 'fallback visual do player'],
  ["video.addEventListener('playing'", 'troca do poster após reprodução'],
  ['@media(max-width:600px)', 'layout mobile dedicado']
];

for (const [needle, label] of checks) {
  if (!js.includes(needle)) throw new Error(`Validação falhou: ${label}`);
}

if (js.includes('helena-video-02.mp4') || js.includes('createAboutVideo')) {
  throw new Error('Validação falhou: referências ao vídeo 2 ainda existem');
}

const fixPath = path.join(out, 'video-fix.js');
const fixJs = fs.readFileSync(fixPath, 'utf8');
const fixChecks = [
  ["CLEAN_POSTER = 'assets/helena-portrait.jpg'", 'capa limpa da Helena'],
  ['hv-clean-poster-styles', 'estilos de limpeza visual'],
  ['MutationObserver', 'proteção contra restauração da capa antiga'],
  ['hv-watermark-mask', 'reforço da máscara no player']
];
for (const [needle, label] of fixChecks) {
  if (!fixJs.includes(needle)) throw new Error(`Validação v37 falhou: ${label}`);
}

const indexPath = path.join(out, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('index.html não encontrado');
let html = fs.readFileSync(indexPath, 'utf8');
const mainLoader = '<script src="script.js?v=36"></script>';
const mainRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (mainRegex.test(html)) {
  html = html.replace(mainRegex, mainLoader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${mainLoader}\n</body>`);
}

const fixLoader = '<script src="video-fix.js?v=37"></script>';
html = html.replace(/\s*<script\s+src=["']video-fix\.js\?v=\d+["']><\/script>/g, '');
if (!html.includes('</body>')) throw new Error('index.html sem </body> para video-fix');
html = html.replace('</body>', `  ${fixLoader}\n</body>`);
fs.writeFileSync(indexPath, html, 'utf8');

fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

console.log('Build v37 validado: capa limpa + proteção contra marca Descript + player mobile v36.');
