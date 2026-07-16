import { createRuleTester } from '../helpers/rule-tester';
import { noDynamicImports } from '../../src/rules/no-dynamic-imports';

const tester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-dynamic-imports', noDynamicImports, {
  valid: [
    {
      code: "const mod = await import('./allowed');",
      options: ['./forbidden'],
    },
    {
      code: "const mod = await import('./other');",
      options: [{ path: './forbidden', message: 'custom' }],
    },
    {
      code: "const mod = await import('./allowed');",
      options: [],
    },
    {
      code: 'const mod = await import(path);',
      options: ['./forbidden'],
    },
  ],
  invalid: [
    {
      code: "const mod = await import('./forbidden');",
      options: ['./forbidden'],
      errors: [
        {
          messageId: 'restrictedImport',
          data: { message: "Using './forbidden' is not allowed." },
        },
      ],
    },
    {
      code: "const mod = await import('./legacy');",
      options: [{ path: './legacy', message: 'Use modern module instead.' }],
      errors: [
        {
          messageId: 'restrictedImport',
          data: { message: 'Use modern module instead.' },
        },
      ],
    },
    {
      code: "const mod = await import('./deprecated');",
      options: [{ path: './deprecated' }],
      errors: [
        {
          messageId: 'restrictedImport',
          data: { message: "Using './deprecated' is not allowed." },
        },
      ],
    },
  ],
});
