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
  'assets/videos/helena-video-cover-premium.jpg',
  'assets/helena-sobre.jpg',
  'assets/helena-portrait.jpg',
  'video-fix.js',
  'video-ios-guard.js'
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
  ['premium editorial video experience v36', 'versão v36 do player base'],
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
let fixJs = fs.readFileSync(fixPath, 'utf8');
const fixChecks = [
  ['clean video player v38', 'versão v38 da correção'],
  ["CLEAN_POSTER = 'assets/helena-portrait.jpg'", 'poster legado a ser substituído no build'],
  ['hv-clean-player-styles', 'estilos do player limpo'],
  ['hv-clean-controls', 'controles premium próprios'],
  ['hv-clean-progress', 'controle de progresso'],
  ['video.controls = false', 'remoção dos controles nativos'],
  ['data-hv-clean-player', 'marcação do player v38']
];
for (const [needle, label] of fixChecks) {
  if (!fixJs.includes(needle)) throw new Error(`Validação v38 falhou: ${label}`);
}

fixJs = fixJs
  .replace(
    "const CLEAN_POSTER = 'assets/helena-portrait.jpg';",
    "const CLEAN_POSTER = 'assets/videos/helena-video-cover-premium.jpg?v=46';"
  )
  .replace(
    '.hv-card img,\n      .hv-poster-layer img {',
    '.hv-poster-layer img {'
  )
  .replace(
    "scope.querySelectorAll('.hv-card img, .hv-poster-layer img')",
    "scope.querySelectorAll('.hv-poster-layer img')"
  );

if (!fixJs.includes("scope.querySelectorAll('.hv-poster-layer img')")) {
  throw new Error('Validação v46 falhou: correção do player não está isolada do card');
}
fs.writeFileSync(fixPath, fixJs, 'utf8');

const guardPath = path.join(out, 'video-ios-guard.js');
const guardJs = fs.readFileSync(guardPath, 'utf8');
const guardChecks = [
  ['iOS fullscreen guard v46', 'versão v46 do guard'],
  ['crisp video cover v46', 'capa nítida v46'],
  ["VIDEO_SRC = 'assets/videos/helena-video-01.mp4?v=46'", 'frame vindo do MP4 original'],
  ['hv-crisp-cover-video', 'vídeo de fundo nítido'],
  ['preload', 'carregamento controlado'],
  ['freezeFrame', 'congelamento do frame'],
  ["data-hv-crisp-cover', 'v46'", 'marcação v46'],
  ['object-fit: cover', 'enquadramento da capa'],
  ['pointer-events: none', 'card continua clicável']
];
for (const [needle, label] of guardChecks) {
  if (!guardJs.includes(needle)) throw new Error(`Validação v46 falhou: ${label}`);
}

const indexPath = path.join(out, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('index.html não encontrado');
let html = fs.readFileSync(indexPath, 'utf8');

const mainLoader = '<script src="script.js?v=36"></script>';
html = html.replace(/<script\s+src=["']script\.js\?v=\d+["']><\/script>/g, mainLoader);

const fixLoader = '<script src="video-fix.js?v=46"></script>';
html = html.replace(/\s*<script\s+src=["']video-fix\.js\?v=\d+["']><\/script>/g, '');
html = html.replace(/\s*<script\s+src=["']video-ios-guard\.js\?v=\d+["']><\/script>/g, '');
if (!html.includes('</body>')) throw new Error('index.html sem </body>');
html = html.replace('</body>', `  ${fixLoader}\n  <script src="video-ios-guard.js?v=46"></script>\n</body>`);
fs.writeFileSync(indexPath, html, 'utf8');

fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

console.log('Build v46 validado: capa nítida capturada do MP4 original no Safari/iPhone.');
