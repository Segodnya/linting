import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Linter } from 'eslint';

import { lintFixture } from './helpers/lint';

const here = dirname(fileURLToPath(import.meta.url));
const distPath = resolve(here, '..', 'dist', 'index.mjs');
const fixture = resolve(here, 'fixtures', 'invalid-export-all.js');

/**
 * Unlike the preset tests (which run against `src`), this one imports the
 * built bundle to prove tsup wired the custom rules in: `kommo/no-export-all`
 * lives in `@kommo-crm/eslint-plugin`, so a firing rule here confirms the
 * plugin resolves from `dist/index.mjs` at runtime, not just from source.
 */
test(
  'built dist flat-config fires kommo/no-export-all (skipped if build did not run)',
  { skip: !existsSync(distPath) },
  async () => {
    const { base } = (await import(pathToFileURL(distPath).href)) as {
      base: () => Linter.Config[];
    };

    const { ruleIds } = await lintFixture(base(), fixture);

    assert.ok(
      ruleIds.includes('kommo/no-export-all'),
      `expected kommo/no-export-all to fire from the built config, got: ${ruleIds.join(', ')}`
    );
  }
);
