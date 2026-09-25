// After `vite build`: give every design its own folder with a copy of index.html, so `/NN/` works on any static host
// (GitHub Pages, Vercel, a plain file server) without rewrite rules. 404.html sends unknown paths to the index.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
const numbers = (await readdir('src/v')).filter(name => /^\d\d-/.test(name)).map(name => name.slice(0, 2));
for (const number of numbers) {
  await mkdir(`dist/${number}`, { recursive: true });
  await writeFile(`dist/${number}/index.html`, html);
}
await writeFile('dist/404.html', html);
console.log(`pages: wrote ${numbers.length} design routes`);
