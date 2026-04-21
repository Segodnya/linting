import { createRuleTester } from '../helpers/rule-tester';
import { noRestrictedSyntax } from '../../../src/eslint/plugin/rules/no-restricted-syntax';

const tester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-restricted-syntax (proxy)', noRestrictedSyntax, {
  valid: [
    { code: 'const a = 1;' },
    {
      code: "const x = 'ok';",
      options: [
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'no fetch',
        },
      ],
    },
  ],
  invalid: [
    {
      code: "fetch('/api');",
      options: [
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'Use $.ajax',
        },
      ],
      errors: [{ message: 'Use $.ajax' }],
    },
    {
      code: 'const x = 1; const y = 2;',
      options: [
        { selector: 'VariableDeclaration', message: 'no declarations' },
      ],
      errors: [{ message: 'no declarations' }, { message: 'no declarations' }],
    },
  ],
});
