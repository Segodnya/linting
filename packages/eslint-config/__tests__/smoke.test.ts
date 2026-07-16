import { test } from 'node:test';
import assert from 'node:assert/strict';
import { base, typescript, react } from '../src/index';

test('presets compose into a single flat-config array', () => {
  const config = [...base(), ...typescript(), ...react()];

  assert.ok(Array.isArray(config));
  assert.ok(config.length > 0);
});

test('base preset forwards rules override as last config block', () => {
  const config = base({ rules: { 'no-console': 'off' } });
  const last = config[config.length - 1];

  assert.equal((last?.rules as Record<string, unknown>)['no-console'], 'off');
});

test('typescript preset forwards rules override', () => {
  const config = typescript({
    rules: { '@typescript-eslint/no-unused-vars': 'warn' },
  });
  const last = config[config.length - 1];

  assert.equal(
    (last?.rules as Record<string, unknown>)[
      '@typescript-eslint/no-unused-vars'
    ],
    'warn'
  );
});

test('react preset forwards rules override', () => {
  const config = react({ rules: { 'react/jsx-uses-react': 'off' } });
  const last = config[config.length - 1];

  assert.equal(
    (last?.rules as Record<string, unknown>)['react/jsx-uses-react'],
    'off'
  );
});
