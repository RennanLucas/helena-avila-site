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

// Mantém o deploy estável. A mídia é tratada separadamente do pipeline de build.
const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const loader = '<script src="script.js?v=24"></script>';
const loaderRegex = /<script\s+src=["']script\.js\?v=\d+["']><\/script>/g;
if (loaderRegex.test(html)) {
  html = html.replace(loaderRegex, loader);
} else {
  if (!html.includes('</body>')) throw new Error('index.html sem </body>');
  html = html.replace('</body>', `  ${loader}\n</body>`);
}
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Build estático preparado com pipeline estável (v24).');