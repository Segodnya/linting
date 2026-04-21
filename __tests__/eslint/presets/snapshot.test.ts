import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
  buildSnapshotConfig,
  collectSnapshot,
  readSnapshot,
} from '../helpers/snapshot';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, '..', 'fixtures');
const config = buildSnapshotConfig(fixturesDir);

const FIXTURES = [
  { fixture: 'invalid.js', snapshot: 'invalid.js.errors.json' },
  { fixture: 'invalid.tsx', snapshot: 'invalid.tsx.errors.json' },
] as const;

for (const { fixture, snapshot } of FIXTURES) {
  test(`snapshot: ${fixture} matches ${snapshot}`, async () => {
    const actual = await collectSnapshot(config, resolve(fixturesDir, fixture));
    const expected = await readSnapshot(resolve(fixturesDir, snapshot));

    assert.deepStrictEqual(
      actual,
      expected,
      `lint output diverged from ${snapshot}; run "yarn test:snapshot:update" if the change is intentional`
    );
  });
}
