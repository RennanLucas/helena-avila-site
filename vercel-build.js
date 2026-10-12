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
const cover = fs.readFileSync(coverPath);
if (cover.length < 12000) throw new Error('Validação v44 falhou: capa premium pequena demais');
if (cover[0] !== 0xff || cover[1] !== 0xd8 || cover[cover.length - 2] !== 0xff || cover[cover.length - 1] !== 0xd9) {
  throw new Error('Validação v44 falhou: capa premium não é um JPEG íntegro');
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

/* v44: o script de correção atua somente dentro do modal/player. */
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
    "const CLEAN_POSTER = 'assets/videos/helena-video-cover-premium.jpg?v=44';"
  )
  .replace(
    '.hv-card img,\n      .hv-poster-layer img {',
    '.hv-poster-layer img {'
  )
  .replace(
    "scope.querySelectorAll('.hv-card img, .hv-poster-layer img')",
    "scope.querySelectorAll('.hv-poster-layer img')"
  );
if (!fixJs.includes("CLEAN_POSTER = 'assets/videos/helena-video-cover-premium.jpg?v=44'")) {
  throw new Error('Validação v44 falhou: poster premium não aplicado ao modal');
}
if (!fixJs.includes("scope.querySelectorAll('.hv-poster-layer img')")) {
  throw new Error('Validação v44 falhou: correção do player ainda não foi isolada do card');
}
if (fixJs.includes("scope.querySelectorAll('.hv-card img, .hv-poster-layer img')")) {
  throw new Error('Validação v44 falhou: correção ainda pode sobrescrever a capa do card');
}
fs.writeFileSync(fixPath, fixJs, 'utf8');

/* Safari/iPhone: força a capa íntegra e um cache key novo. */
const guardPath = path.join(out, 'video-ios-guard.js');
let guardJs = fs.readFileSync(guardPath, 'utf8');
const guardChecks = [
  ['iOS fullscreen guard v39', 'versão v39 do guard'],
  ['frameFullscreenSupported', 'detecção de fullscreen do container'],
  ['data-hv-native-fullscreen-blocked', 'bloqueio do fullscreen nativo'],
  ['fullButton.hidden = true', 'remoção do botão inseguro no iOS'],
  ['premium video cover v42', 'versão base da capa'],
  ["CARD_COVER = 'assets/videos/helena-video-cover-premium.jpg'", 'asset da capa premium'],
  ['CARD_COVER_VERSIONED', 'cache-bust da capa no Safari'],
  ['data-hv-premium-cover', 'aplicação da capa premium no card'],
  ['object-fit: cover', 'renderização da capa como imagem real']
];
for (const [needle, label] of guardChecks) {
  if (!guardJs.includes(needle)) throw new Error(`Validação da capa falhou: ${label}`);
}
guardJs = guardJs.replace(/v42/g, 'v44').replace(/v=42/g, 'v=44');
if (!guardJs.includes("CARD_COVER_VERSIONED = CARD_COVER + '?v=44'")) {
  throw new Error('Validação v44 falhou: cache-bust da capa não atualizado');
}
if (!guardJs.includes("data-hv-premium-cover', 'v44'")) {
  throw new Error('Validação v44 falhou: card não marcado como v44');
}
fs.writeFileSync(guardPath, guardJs, 'utf8');

const indexPath = path.join(out, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('index.html não encontrado');
let html = fs.readFileSync(indexPath, 'utf8');
const mainLoader = '<script src="script.js?v=36"></script>';
html = html.replace(/<script\s+src=["']script\.js\?v=\d+["']><\/script>/g, mainLoader);
html = html.replace(/\s*<script\s+src=["']video-fix\.js\?v=\d+["']><\/script>/g, '');
html = html.replace(/\s*<script\s+src=["']video-ios-guard\.js\?v=\d+["']><\/script>/g, '');
if (!html.includes('</body>')) throw new Error('index.html sem </body>');
html = html.replace('</body>', '  <script src="video-fix.js?v=44"></script>\n  <script src="video-ios-guard.js?v=44"></script>\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');

fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });
console.log('Build v44 validado: JPEG íntegro no card; vídeo permanece isolado até a interação.');
