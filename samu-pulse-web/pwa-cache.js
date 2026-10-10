// O cache inicial acompanha apenas os imports estáticos da entrada.
// Imports dinâmicos (telas e suporte PWA) são carregados sob demanda.
export function selectPrecacheEntries(entries, manifest) {
  const allowed = new Set(['index.html']);
  const visited = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const chunk = manifest[key];
    if (!chunk) throw new Error('Chunk ausente no manifesto: ' + key);
    allowed.add(chunk.file);
    for (const file of [...(chunk.css || []), ...(chunk.assets || [])]) allowed.add(file);
    for (const dependency of chunk.imports || []) visit(dependency);
  }
  for (const [key, chunk] of Object.entries(manifest)) {
    if (chunk.isEntry) visit(key);
  }
  if (visited.size === 0) throw new Error('Entrada do aplicativo ausente no manifesto');
  return entries.filter(entry => allowed.has(entry.url));
}
