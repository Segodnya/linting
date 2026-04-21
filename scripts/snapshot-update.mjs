import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
  buildSnapshotConfig,
  collectSnapshot,
  writeSnapshot,
} from '../__tests__/eslint/helpers/snapshot.ts';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, '..', '__tests__', 'eslint', 'fixtures');
const config = buildSnapshotConfig(fixturesDir);

const targets = [
  { fixture: 'invalid.js', snapshot: 'invalid.js.errors.json' },
  { fixture: 'invalid.tsx', snapshot: 'invalid.tsx.errors.json' },
];

await Promise.all(
  targets.map(async (target) => {
    const { fixture, snapshot } = target;

    const fixturePath = resolve(fixturesDir, fixture);
    const snapshotPath = resolve(fixturesDir, snapshot);
    const entries = await collectSnapshot(config, fixturePath);

    await writeSnapshot(snapshotPath, entries);

    console.log(`Wrote ${entries.length} entries to ${snapshot}`);
  })
);
