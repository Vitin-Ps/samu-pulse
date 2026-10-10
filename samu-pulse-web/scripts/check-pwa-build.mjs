import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {selectPrecacheEntries} from '../pwa-cache.js';

const manifest = JSON.parse(readFileSync(new URL('../dist/.vite/manifest.json', import.meta.url)));
const entries = Object.values(manifest).flatMap(chunk => [
  {url: chunk.file}, ...(chunk.css || []).map(url => ({url})),
  ...(chunk.assets || []).map(url => ({url})),
]);
entries.push({url: 'index.html'});
const selected = [...new Set(selectPrecacheEntries(entries, manifest).map(entry => entry.url))];
const worker = readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert(!html.includes('registerSW.js'), 'Registro automático não deve antecipar o registro ocioso');
for (const url of selected) assert(worker.includes(url), 'Dependência inicial ausente do precache: ' + url);
for (const key of ['src/pages/ListMembers/index.tsx', 'src/pages/AddMember/index.tsx',
  'src/pages/components/PwaStatus.tsx', 'src/pages/components/Elements/Progress/ProgressSpinner.tsx']) {
  assert(manifest[key]?.isDynamicEntry, 'Esperado carregamento sob demanda: ' + key);
  assert(!selected.includes(manifest[key].file), 'Tela pesada voltou ao carregamento inicial');
  assert(!worker.includes(manifest[key].file), 'Tela sob demanda voltou ao precache');
}
const files = selected.filter(url => url.endsWith('.js'));
const bytes = files.reduce((sum, url) => sum + statSync(new URL('../dist/' + url, import.meta.url)).size, 0);
const gzipBytes = files.reduce((sum, url) => sum + gzipSync(readFileSync(new URL('../dist/' + url, import.meta.url))).length, 0);
assert(bytes < 500_000, 'JavaScript inicial excede o orçamento de 500 KB');
assert(gzipBytes < 160_000, 'JavaScript inicial comprimido excede 160 KB');
console.log('PWA: imports iniciais cobertos e telas pesadas fora do precache.');
console.log(JSON.stringify({initialJavaScriptBytes: bytes, initialJavaScriptGzipBytes: gzipBytes}, null, 2));
