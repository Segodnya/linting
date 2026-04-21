import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { base, react, typescript } from '../../../src/eslint';

const here = dirname(fileURLToPath(import.meta.url));
const legacyPath = resolve(
  here,
  '..',
  '..',
  '..',
  'dist',
  'eslint',
  'legacy.cjs'
);

test(
  'legacy.cjs is auto-generated (skipped if build did not run)',
  { skip: !existsSync(legacyPath) },
  () => {
    const require = createRequire(import.meta.url);
    const legacy = require(legacyPath) as {
      parser: string;
      extends: string[];
      plugins: string[];
      rules: Record<string, unknown>;
    };

    assert.equal(legacy.parser, '@typescript-eslint/parser');
    assert.ok(legacy.extends.includes('eslint:recommended'));
    assert.ok(legacy.plugins.length > 0);
    assert.ok(Object.keys(legacy.rules).length > 10);
  }
);

test(
  'legacy rules are a subset of flat rules (minus custom kommo/ namespace)',
  { skip: !existsSync(legacyPath) },
  () => {
    const require = createRequire(import.meta.url);
    const legacy = require(legacyPath) as { rules: Record<string, unknown> };

    const flatRules = new Set<string>();

    for (const cfg of [...base(), ...typescript(), ...react()]) {
      if (cfg.rules) {
        for (const key of Object.keys(cfg.rules)) {
          flatRules.add(key);
        }
      }
    }

    for (const key of Object.keys(legacy.rules)) {
      assert.ok(
        flatRules.has(key),
        `legacy rule "${key}" is not present in flat presets — build-legacy.mjs drift`
      );
    }
  }
);
