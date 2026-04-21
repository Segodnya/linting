import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Linter } from 'eslint';
import { base, react, typescript } from '../../../src/eslint';

test('presets compose without duplicate-plugin errors', () => {
  const config = [...base(), ...typescript(), ...react()];
  const linter = new Linter({ configType: 'flat' });

  const messages = linter.verify('const x = 1;\n', config);

  assert.ok(Array.isArray(messages));
  assert.ok(
    !messages.some((message) => {
      return message.fatal === true;
    }),
    `fatal messages: ${JSON.stringify(messages.filter((m) => m.fatal))}`
  );
});

test('options.rules override reaches consumer', () => {
  const config = base({ rules: { 'no-console': 'off' } });
  const last = config[config.length - 1]!;

  assert.equal((last.rules as Record<string, unknown>)['no-console'], 'off');
});
