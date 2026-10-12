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

const coverPath = path.join(out, 'assets', 'videos', 'helena-video-cover-premium.jpg');
if (fs.statSync(coverPath).size < 10000) {
  throw new Error('Validação v45 falhou: capa premium incompleta');
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

/*
 * v45: o player continua isolado do card. O poster do modal usa a mesma capa
 * premium e o card é renderizado por background CSS para evitar o ícone de
 * imagem quebrada do Safari/iPhone.
 */
const fixPath = path.join(out, 'video-fix.js');
let fixJs = fs.readFileSync(fixPath, 'utf8');
const fixChecks = [
  ['clean video player v38', 'versão v38 da correção'],
  ["CLEAN_POSTER = 'assets/helena-portrait.jpg'", 'poster legado a ser substituído no build'],
  ['hv-clean-player-styles', 'estilos do player limpo'],
  ['hv-clean-controls', 'controles premium próprios'],
  ['hv-clean-progress', 'controle de progresso'],
  ['video.controls = false', 'remoção dos controles nativos'],
  ['height: 15%', 'faixa integral sobre a região da marca'],
  ['data-hv-clean-player', 'marcação do player v38'],
  ['hv-watermark-mask', 'camada de limpeza do vídeo']
];
for (const [needle, label] of fixChecks) {
  if (!fixJs.includes(needle)) throw new Error(`Validação v38 falhou: ${label}`);
}

fixJs = fixJs
  .replace(
    "const CLEAN_POSTER = 'assets/helena-portrait.jpg';",
    "const CLEAN_POSTER = 'assets/videos/helena-video-cover-premium.jpg?v=45';"
  )
  .replace(
    '.hv-card img,\n      .hv-poster-layer img {',
    '.hv-poster-layer img {'
  )
  .replace(
    "scope.querySelectorAll('.hv-card img, .hv-poster-layer img')",
    "scope.querySelectorAll('.hv-poster-layer img')"
  );

if (!fixJs.includes("CLEAN_POSTER = 'assets/videos/helena-video-cover-premium.jpg?v=45'")) {
  throw new Error('Validação v45 falhou: poster premium não aplicado ao modal');
}
if (!fixJs.includes("scope.querySelectorAll('.hv-poster-layer img')")) {
  throw new Error('Validação v45 falhou: correção do player ainda não foi isolada do card');
}
if (fixJs.includes("scope.querySelectorAll('.hv-card img, .hv-poster-layer img')")) {
  throw new Error('Validação v45 falhou: player ainda pode sobrescrever a capa do card');
}
fs.writeFileSync(fixPath, fixJs, 'utf8');

const guardPath = path.join(out, 'video-ios-guard.js');
const guardJs = fs.readFileSync(guardPath, 'utf8');
const guardChecks = [
  ['iOS fullscreen guard v45', 'versão v45 do guard'],
  ['frameFullscreenSupported', 'detecção de fullscreen do container'],
  ['data-hv-native-fullscreen-blocked', 'bloqueio do fullscreen nativo'],
  ['fullButton.hidden = true', 'remoção do botão inseguro no iOS'],
  ['premium video cover v45', 'versão v45 da capa'],
  ["CARD_COVER = 'assets/videos/helena-video-cover-premium.jpg'", 'asset da capa premium'],
  ["CARD_COVER_VERSIONED = CARD_COVER + '?v=45'", 'cache-bust da capa no Safari'],
  ["data-hv-premium-cover', 'v45'", 'aplicação da capa premium no card'],
  ['background-size: cover', 'renderização da capa como background'],
  ['display: none !important', 'remoção visual da imagem quebrada no Safari']
];
for (const [needle, label] of guardChecks) {
  if (!guardJs.includes(needle)) throw new Error(`Validação v45 falhou: ${label}`);
}

const indexPath = path.join(out, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('index.html não encontrado');
let html = fs.readFileSync(indexPath, 'utf8');

const mainLoader = '<script src="script.js?v=36"></script>';
html = html.replace(/<script\s+src=["']script\.js\?v=\d+["']><\/script>/g, mainLoader);

const fixLoader = '<script src="video-fix.js?v=45"></script>';
html = html.replace(/\s*<script\s+src=["']video-fix\.js\?v=\d+["']><\/script>/g, '');
html = html.replace(/\s*<script\s+src=["']video-ios-guard\.js\?v=\d+["']><\/script>/g, '');
if (!html.includes('</body>')) throw new Error('index.html sem </body>');
html = html.replace('</body>', `  ${fixLoader}\n  <script src="video-ios-guard.js?v=45"></script>\n</body>`);
fs.writeFileSync(indexPath, html, 'utf8');

fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

console.log('Build v45 validado: capa do card via background CSS para Safari/iPhone e player preservado.');
