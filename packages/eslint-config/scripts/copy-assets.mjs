import { cp, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const assets = [
  ['src/types/global.d.ts', 'dist/types/global.d.ts'],
];

await Promise.all(
  assets.map(async ([from, to]) => {
    await mkdir(dirname(to), { recursive: true });
    await cp(from, to);
  })
);

console.log(`Copied ${assets.length} asset(s) to dist/`);
