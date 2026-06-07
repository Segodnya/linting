import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import tseslint from 'typescript-eslint';
import type { Linter } from 'eslint';
import { base, react, typescript } from '../../src';
import { disablePrettier, lintFixture } from '../helpers/lint';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, '..', 'fixtures');

const tsxConfig: Linter.Config[] = [
  ...base(),
  ...typescript(),
  ...react(),
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser as unknown as Linter.Parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: fixturesDir,
        ecmaFeatures: { jsx: true },
      },
    },
  },
  disablePrettier,
];

test('react preset: valid.tsx — 0 errors', async () => {
  const result = await lintFixture(
    tsxConfig,
    resolve(fixturesDir, 'valid.tsx')
  );

  assert.equal(
    result.errorCount,
    0,
    `got errors: ${JSON.stringify(result.messages, null, 2)}`
  );
});

test('react preset: invalid.tsx — boolean-prop-naming fires', async () => {
  const result = await lintFixture(
    tsxConfig,
    resolve(fixturesDir, 'invalid.tsx')
  );
  const uniqueIds = new Set(result.ruleIds);

  assert.ok(
    uniqueIds.has('react/boolean-prop-naming'),
    'boolean-prop-naming must fire on `enabled: boolean`'
  );
});

