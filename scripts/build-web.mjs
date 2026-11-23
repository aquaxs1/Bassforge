// Baut aus src/index.html die fertige Web-Oberfläche.
//   node scripts/build-web.mjs            -> www/  (für die Apps: Schriften + Bibliotheken lokal, läuft offline)
//   node scripts/build-web.mjs --artifact -> dist-web/index.html (eine Datei, lädt Schriften/Bibliotheken per CDN)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifact = process.argv.includes('--artifact');
const nm = p => path.join(root, 'node_modules', p);

let html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
const logo = fs.readFileSync(path.join(root, 'src/logo.png')).toString('base64');
html = html.split('__LOGO__').join(logo);

if (artifact) {
  const out = path.join(root, 'dist-web');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), html);
  console.log('dist-web/index.html geschrieben');
  process.exit(0);
}

const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'vendor'), { recursive: true });
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });

// Bibliotheken lokal
for (const [pkg, file] of [['mp4-muxer', 'build/mp4-muxer.js'], ['webm-muxer', 'build/webm-muxer.js']]) {
  fs.copyFileSync(nm(path.join(pkg, file)), path.join(www, 'vendor', path.basename(file)));
}

// Schriften lokal (nur lateinische Zeichensätze, nur woff2)
const FONTS = [
  ['space-grotesk', [400, 500, 700]], ['jetbrains-mono', [500]], ['anton', [400]], ['bebas-neue', [400]],
  ['oswald', [700]], ['archivo-black', [400]], ['bungee', [400]], ['teko', [600]], ['russo-one', [400]],
  ['black-ops-one', [400]], ['permanent-marker', [400]], ['montserrat', [800]], ['playfair-display', [900]],
  ['press-start-2p', [400]], ['monoton', [400]], ['righteous', [400]], ['unbounded', [800]],
];
let css = '';
for (const [pkg, weights] of FONTS) {
  for (const w of weights) {
    const src = fs.readFileSync(nm(`@fontsource/${pkg}/${w}.css`), 'utf8');
    for (const block of src.split('@font-face').slice(1)) {
      const m = block.match(/url\(\.\/files\/([^)]+?-(latin|latin-ext)-\d+-normal)\.woff2\)/);
      if (!m) continue;
      const file = m[1] + '.woff2';
      fs.copyFileSync(nm(`@fontsource/${pkg}/files/${file}`), path.join(www, 'fonts', file));
      const body = block.replace(/src:[^;]+;/, `src: url(./fonts/${file}) format('woff2');`);
      css += '@font-face' + body.trim().replace(/^\{/, '{') + '\n';
    }
  }
}
fs.writeFileSync(path.join(www, 'fonts.css'), css);

html = html.replace(/<!-- WEB:FONTS -->[\s\S]*?<!-- \/WEB:FONTS -->/, '<link rel="stylesheet" href="fonts.css">');
html = html.replace(/<!-- WEB:LIBS -->[\s\S]*?<!-- \/WEB:LIBS -->/,
  '<script src="vendor/mp4-muxer.js"></script>\n<script src="vendor/webm-muxer.js"></script>');
fs.writeFileSync(path.join(www, 'index.html'), html);
fs.copyFileSync(path.join(root, 'src/logo.png'), path.join(www, 'logo.png'));
console.log(`www/ gebaut (${fs.readdirSync(path.join(www, 'fonts')).length} Schriftdateien)`);
