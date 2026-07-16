import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plugin, rules } from '../src';

test('plugin registers all 5 custom rules', () => {
  const expected = [
    'no-export-all',
    'no-incorrect-jsdoc-comments',
    'no-dynamic-imports',
    'no-restricted-syntax',
    'no-restricted-imports',
  ];

  for (const name of expected) {
    assert.ok(rules[name], `rule ${name} must be registered`);
  }

  assert.equal(plugin.meta?.name, '@kommo-crm/eslint-plugin');
  assert.equal(typeof plugin.meta?.version, 'string');
});
