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

function buildMp4(name, partCount) {
  const sourceDir = path.join(out, 'assets', 'video-data');
  const targetDir = path.join(out, 'assets', 'videos');
  fs.mkdirSync(targetDir, { recursive: true });

  let encoded = '';
  for (let i = 1; i <= partCount; i += 1) {
    const part = path.join(sourceDir, `${name}.part${String(i).padStart(2, '0')}.txt`);
    if (!fs.existsSync(part)) throw new Error(`Parte de vídeo ausente: ${part}`);
    encoded += fs.readFileSync(part, 'utf8').replace(/\s+/g, '');
  }

  const buffer = Buffer.from(encoded, 'base64');
  if (buffer.length < 1024 || buffer.subarray(4, 8).toString('ascii') !== 'ftyp') {
    throw new Error(`MP4 inválido gerado para ${name}`);
  }

  const target = path.join(targetDir, `${name}.mp4`);
  fs.writeFileSync(target, buffer);
  console.log(`MP4 gerado: ${path.relative(out, target)} (${buffer.length} bytes)`);
}

buildMp4('helena-video-01', 3);
buildMp4('helena-video-02', 4);

fs.rmSync(path.join(out, 'assets', 'video-data'), { recursive: true, force: true });

const scriptPath = path.join(out, 'script.js');
let js = fs.readFileSync(scriptPath, 'utf8');
const sourcesStart = js.indexOf('  const VIDEO_SOURCES = {');
const iconsStart = js.indexOf('  const playIcon =', sourcesStart);
if (sourcesStart === -1 || iconsStart === -1) {
  throw new Error('Bloco de fontes do player não encontrado em script.js');
}

const directSources = `  const VIDEO_SOURCES = {\n    one: { src: 'assets/videos/helena-video-01.mp4', title: 'Uma conversa com Helena Ávila', duration: '1:35', poster: 'assets/helena-sobre.jpg' },\n    two: { src: 'assets/videos/helena-video-02.mp4', title: 'Uma reflexão com Helena', duration: '2:45', poster: 'assets/helena-portrait.jpg' }\n  };\n\n  async function buildVideoUrl(key) {\n    return VIDEO_SOURCES[key].src;\n  }\n\n`;
js = js.slice(0, sourcesStart) + directSources + js.slice(iconsStart);

const oldOpen = `        try {\n          video.src = await buildVideoUrl(key);\n          video.muted = false;\n          video.currentTime = 0;\n          await video.play().catch(() => {});\n        } catch (err) { console.error('[Helena vídeo]', err); }`;
const newOpen = `        try {\n          const source = VIDEO_SOURCES[key];\n          video.pause();\n          video.poster = source.poster;\n          video.src = await buildVideoUrl(key);\n          video.muted = false;\n          video.load();\n          const attempt = video.play();\n          if (attempt && typeof attempt.catch === 'function') await attempt.catch(() => {});\n        } catch (err) { console.error('[Helena vídeo]', err); }`;
if (!js.includes(oldOpen)) throw new Error('Bloco de abertura do player não encontrado em script.js');
js = js.replace(oldOpen, newOpen);
fs.writeFileSync(scriptPath, js, 'utf8');

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=23"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) html = html.replace(loaderRegex, loader);
else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Build preparado: MP4 reais + player direto v23.');