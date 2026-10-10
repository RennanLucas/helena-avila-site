const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, 'public');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const excluded = new Set(['.git', '.github', 'public', 'node_modules']);
for (const name of fs.readdirSync(root)) {
  if (excluded.has(name)) continue;
  const src = path.join(root, name);
  const dest = path.join(out, name);
  fs.cpSync(src, dest, { recursive: true });
}

const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const hasVideoLoader = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/.test(html);
if (!hasVideoLoader) {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', '  <script src="script.js?v=20"></script>\n</body>');
  fs.writeFileSync(indexPath, html, 'utf8');
}

const scriptPath = path.join(out, 'script.js');
let js = fs.readFileSync(scriptPath, 'utf8');
const oldLine = `  document.write('<script src="script-original.js?v=18"><\\/script>');`;
const safeLine = `  if (!document.getElementById('inicio')) { document.write('<script src="script-original.js?v=18"><\\/script>'); }`;
if (js.includes(oldLine)) {
  js = js.replace(oldLine, safeLine);
} else if (!js.includes(safeLine)) {
  throw new Error('Trecho esperado em script.js não encontrado');
}
fs.writeFileSync(scriptPath, js, 'utf8');

console.log('Build estático preparado com hero de vídeo da Helena.');
