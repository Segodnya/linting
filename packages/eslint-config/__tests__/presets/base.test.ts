import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { base } from '../../src';
import { disablePrettier, lintFixture } from '../helpers/lint';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, '..', 'fixtures');

test('base preset: valid.js — 0 errors, 0 warnings', async () => {
  const result = await lintFixture(
    [...base(), disablePrettier],
    resolve(fixturesDir, 'valid.js')
  );

  assert.equal(result.errorCount, 0);
  assert.equal(result.warningCount, 0);
});

test('base preset: invalid-base.js — expected violations present', async () => {
  const result = await lintFixture(
    [...base(), disablePrettier],
    resolve(fixturesDir, 'invalid-base.js')
  );
  const uniqueIds = new Set(result.ruleIds);

  assert.ok(
    result.errorCount >= 3,
    `expected >= 3 errors, got ${result.errorCount}`
  );
  assert.ok(uniqueIds.has('no-var'), 'no-var must fire');
  assert.ok(uniqueIds.has('eqeqeq'), 'eqeqeq must fire');
  assert.ok(uniqueIds.has('no-alert'), 'no-alert must fire');
});

test('base preset: invalid-export-all.js — kommo/no-export-all fires', async () => {
  const result = await lintFixture(
    [...base(), disablePrettier],
    resolve(fixturesDir, 'invalid-export-all.js')
  );
  const uniqueIds = new Set(result.ruleIds);

  assert.ok(
    uniqueIds.has('kommo/no-export-all'),
    'kommo/no-export-all must fire'
  );
});
