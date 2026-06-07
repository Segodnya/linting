import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { base, typescript } from '../../src';
import { disablePrettier, lintFixture } from '../helpers/lint';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, '..', 'fixtures');

test('typescript preset: valid.ts — 0 errors', async () => {
  const result = await lintFixture(
    [...base(), ...typescript(), disablePrettier],
    resolve(fixturesDir, 'valid.ts')
  );

  assert.equal(
    result.errorCount,
    0,
    `got errors: ${result.ruleIds.join(', ')}`
  );
});

test('typescript preset: invalid.ts — naming-convention, no-explicit-any, no-non-null-assertion fire', async () => {
  const result = await lintFixture(
    [...base(), ...typescript(), disablePrettier],
    resolve(fixturesDir, 'invalid.ts')
  );
  const uniqueIds = new Set(result.ruleIds);

  assert.ok(uniqueIds.has('@typescript-eslint/naming-convention'));
  assert.ok(uniqueIds.has('@typescript-eslint/no-explicit-any'));
  assert.ok(uniqueIds.has('@typescript-eslint/no-non-null-assertion'));
});
